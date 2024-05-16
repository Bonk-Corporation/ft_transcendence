mod input;

use std::sync::Arc;
use futures::{sink::SinkExt, stream::StreamExt};
use axum::{
    extract::{WebSocketUpgrade, ws::{Message, WebSocket}, State},
    response::IntoResponse,
    Router,
    routing::get,
};
use input::{
    Client, Game, GameState, Move, OnConnectClient
};
use tokio::sync::RwLock;
use futures::lock::Mutex;
use create::input::EndGame;

const AI_ID: &str = "ROBOCOP"; 

#[derive(Debug)]
struct Clients {
    poll: Vec<Client>,
    games: Vec<Game>,
    bot_games: Vec<Client>,
}

impl Clients {
    async fn add_client(&mut self, client: Client) -> Result<(), String> {

        for cl in self.poll.as_slice() {
            match cl.id.as_str() {
                num if num == client.id.clone()  => return Err("Client already in poll".to_string()),
                _ => (),
            }
        }

        self.poll.push(client.into());
        Ok(())
    }

    async fn start_game(&mut self, client_id: String) -> Result<String, String> {
        let mut found = false;
        let mut game_id = None;
        for client in self.poll.as_mut_slice()  {
            match client.id.as_str() {
                num if num == client_id.as_str() => {
                    if let Some(_) = client.id_game {
                        break;
                    }
                    found = true;
                    for game in self.games.as_mut_slice() {
                        if game.is_full() {
                            continue;
                        } else {
                            println!("Game found");
                            game_id = Some(game.id.clone());
                            client.id_game = Some(game_id.as_ref().unwrap().clone());
                            game.add_player(client.clone());
                            if game.is_full() {
                                let mut game_clone = game.clone();
                                tokio::spawn(async move {
                                    let winner = game_clone.start().await;
                                    match winner {
                                        EndGame::Player1 => println!("Player 1 won"),
                                        EndGame::Player2 => println!("Player 2 won"),
                                        EndGame::Draw => println!("Draw"),
                                        EndGame::Undecided => println!("Undecided"),
                                    }
                                });
                            }
                            break;
                        }
                    }
                    if None == client.id_game {
                        game_id = Some(uuid::Uuid::new_v4().to_string());
                        self.games.push(Game::new(client.clone(), game_id.as_ref().unwrap().clone()));
                        client.id_game = Some(game_id.as_ref().unwrap().clone());
                        println!("Game created");
                    }
                    break;
                },
                _ => (),
            }
        }
        if !found {
            Err("Cannot join new match".to_string())
        } else {
            Ok(game_id.unwrap())
        }
    }

    async fn start_solo(&mut self, client_id: String) -> Result<String, String> {
        let mut game_id = None;
        for client in self.poll.as_mut_slice() {
            match client.id.as_str() {
                num if num == client_id => {
                    if let Some(_) = client.id_game {
                        return Err("Client already in game".to_string());
                    }
                    game_id = Some(uuid::Uuid::new_v4().to_string());
                    let new_ai_game = Client {
                        id: AI_ID.to_string(),
                        name: "AI".to_string(),
                        id_game: game_id.clone(),
                    };
                    let mut new_solo = Game::new_solo(client.clone(), new_ai_game.clone(), game_id.as_ref().unwrap().clone());
                    self.games.push(new_solo.clone());
                    self.bot_games.push(new_ai_game);
                    tokio::spawn(async move {
                        let winner = new_solo.start().await;
                        match winner {
                            EndGame::Player1 => println!("Player 1 won"),
                            EndGame::Player2 => println!("Player 2 won"),
                            EndGame::Draw => println!("Draw"),
                            EndGame::Undecided => println!("Undecided"),
                        }
                    });
                    client.id_game = Some(game_id.as_ref().unwrap().clone());
                },
                _ => (),
            }
        }
        Ok(game_id.unwrap())
    }

    async fn receive_move(&self, movement: Move) -> Result<(), Box<dyn std::error::Error>> {
        for game in self.games.as_slice() {
            if movement.game_id == game.id {
                match (game.player1.clone(), game.player2.clone()) {
                    (_, None) | (None, _) => return Err("Error: Missing at least a player".into()),
                    (Some(_player1), Some(_player2)) => {
                        game.tx.send("MOVE ".to_owned() + &serde_json::to_string_pretty(&movement).unwrap())
                    },
                }?;
                break;
            }
        }
        Ok(())
    }

    async fn stop_move(&self, movement: Move) -> Result<(), Box<dyn std::error::Error>> {
        for game in self.games.as_slice() {
            if movement.game_id == game.id {
                match (game.player1.clone(), game.player2.clone()) {
                    (_, None) | (None, _) => return Err("Error: Missing at least a player".into()),
                    (Some(_player1), Some(_player2)) => {
                        game.tx.send("MOVE".to_owned() + &serde_json::to_string_pretty(&movement).unwrap())
                    },
                }?;
                break;
            }
        }
        Ok(())
    }

    async fn get_game(&self, game_id: String) -> Result<Game, String> {
        for game in self.games.as_slice() {
            if game.id == game_id {
                return Ok(game.clone())
            }
        }
        Err("No game found".to_string())
    }

    fn get_game_states(&self) -> Vec<Arc<Mutex<GameState>>> {
        let mut game_states = vec![];
        for game in self.games.as_slice() {
            if let Some(ai) = &game.player2 {
                if &ai.name == AI_ID {
                    game_states.push(Arc::clone(&game.game_state));
                }
            }
        }

        game_states
    }
}

async fn websocket_handler(State(state): State<Arc<RwLock<Clients>>>, ws: WebSocketUpgrade) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(state, socket))
}

async fn handle_socket(state: Arc<RwLock<Clients>>, socket: WebSocket) {
    let (sender, mut receiver) = socket.split();
    let sender = Arc::new(RwLock::new(sender));
    let mut join_handler = vec![];
    let mut client = Client {
        id: "".to_string(),
        name: "Player".to_string(),
        id_game: None,
    };
    while let Some(Ok(msg)) = receiver.next().await {
        match msg {
            Message::Text(text) => {
                println!("Got message from client: {}", text);
                match &text[0..5] {
                    "NEW  " => {
                        let on_connect: OnConnectClient = serde_json::from_str(&text[5..]).unwrap();
                        client = Client {
                            id: on_connect.id,
                            name: "Player".to_string(),
                            id_game: None,
                        };
                        state.write().await.add_client(client.clone()).await.unwrap();
                        sender.write().await.send(Message::Text(format!("{} added to poll | id: {}", client.name, client.id)))
                            .await
                            .unwrap();
                    },
                    "MOVE " => {
                        let movement: Move = serde_json::from_str(&text[5..]).unwrap();
                        if let Ok(_) = state.read().await.receive_move(movement).await {
                            println!("move succeeded");
                        }
                    },
                    "MOVE" => {
                        let movement: Move = serde_json::from_str(&text[5..]).unwrap();
                        if let Ok(_) = state.read().await.stop_move(movement).await {
                            println!("stop move succeeded");
                        }
                    },
                    "MULTI" => {
                        let on_connect: OnConnectClient = serde_json::from_str(&text[5..]).unwrap();
                        let client = Client {
                            id: on_connect.id,
                            name: "Player".to_string(),
                            id_game: None,
                        };
                        let game_id: Option<String> = match state.write().await.start_game(client.id).await {
                            Ok(game_id) => {
                                sender.write().await.send(Message::Text("GAMEID".to_owned() + &game_id))
                                            .await
                                            .unwrap();
                                Some(game_id)
                            },
                            Err(err) => {
                                println!("{}", err);
                                None
                            },
                        };
                        let cl_state = Arc::clone(&state);
                        let ptr_ws = Arc::clone(&sender);
                        join_handler.push(tokio::spawn(async move {
                            if game_id == None {
                                return;
                            }
                            loop  {
                                if let Err(_) = cl_state.read().await.get_game(game_id.clone().unwrap()).await {
                                    break;
                                }
                                tokio::time::sleep(tokio::time::Duration::from_millis(33)).await;
                                let game_state = if let Ok(game) = cl_state.read().await.get_game(game_id.clone().unwrap()).await {
                                    game.game_state
                                } else {
                                    break;
                                };
                                if game_state.lock().await.ball_ent.velocity.x != 0. {
                                    game_state.lock().await.update_ball();
                                    game_state.lock().await.update_score();
                                    match ptr_ws.write().await.send(Message::Text("UPDATE".to_owned() + &serde_json::to_string(&(*game_state.lock().await)).unwrap())).await {
                                        Ok(_) => (),
                                        Err(_) => return,
                                    };
                                }
                                if game_state.lock().await.finished {
                                    let player1_id = if let Ok(game) = cl_state.read().await.get_game(game_id.clone().unwrap()).await {
                                        game.player1.unwrap().id
                                    } else {
                                        return;
                                    };
                                    let player2_id = if let Ok(game) = cl_state.read().await.get_game(game_id.clone().unwrap()).await {
                                        game.player2.unwrap().id
                                    } else {
                                        return;
                                    };
                                    let mut count = 0;
                                    for client in cl_state.write().await.poll.as_mut_slice() {
                                        if client.id == player1_id {
                                            client.id_game = None;
                                            count += 1;
                                        } else if client.id == player2_id {
                                            client.id_game = None;
                                        }
                                        if count >= 2 {
                                            break;
                                        }
                                    }
                                    println!("quitting thread");
                                    return;
                                }
                            }
                        }));
                    },
                    "SOLO" => {
                        let on_connect: OnConnectClient = serde_json::from_str(&text[5..]).unwrap();
                        let client = Client {
                            id: on_connect.id,
                            name: "Player".to_string(),
                            id_game: None,
                        };
                        let game_id: Option<String> = match state.write().await.start_solo(client.id).await {
                            Ok(game_id) => {
                                sender.write().await.send(Message::Text("GAMEID".to_owned() + &game_id))
                                            .await
                                            .unwrap();
                                Some(game_id)
                            },
                            Err(err) => {
                                println!("{}", err);
                                None
                            },
                        };
                        let cl_state = Arc::clone(&state);
                        let ptr_ws = Arc::clone(&sender);
                        join_handler.push(tokio::spawn(async move {
                            if game_id == None {
                                return;
                            }
                            loop {
                                tokio::time::sleep(tokio::time::Duration::from_millis(33)).await;
                                let game_state = cl_state.read().await.get_game(game_id.clone().unwrap()).await.unwrap().game_state;
                                if game_state.lock().await.ball_ent.velocity.x != 0. {
                                    game_state.lock().await.update_ball();
                                    game_state.lock().await.update_score();
                                    match ptr_ws.write().await.send(Message::Text("UPDATE".to_owned() + &serde_json::to_string(&(*game_state.lock().await)).unwrap())).await {
                                        Ok(_) => (),
                                        Err(_) => return,
                                    };
                                }
                            }
                        }));
                    }
                    "OURAI" => {
                        let cl_state = Arc::clone(&state);
                        let ptr_ws = Arc::clone(&sender);
                        join_handler.push(tokio::spawn(async move {
                            loop {
                                tokio::time::sleep(tokio::time::Duration::from_millis(33)).await;
                                let game_states = cl_state.read().await.get_game_states();
                                for game_state in game_states {
                                    if game_state.lock().await.ball_ent.velocity.x != 0. {
                                        game_state.lock().await.update_ball();
                                        game_state.lock().await.update_score();
                                        match ptr_ws.write().await.send(Message::Text("UPDATE".to_owned() + &serde_json::to_string(&(*game_state.lock().await)).unwrap())).await {
                                            Ok(_) => (),
                                            Err(_) => return,
                                        };
                                    }
                                }
                            }
                        }));
                    }
                    _ => {
                        sender.write().await.send(Message::Text("Unknown command".to_string()))
                            .await
                            .unwrap();
                    },
                }
            },
            Message::Close(_) => {
                println!("Client Disconnected...");
                let mut index: i16 = -1;
                let mut in_game = false;
                let mut game_id = String::new();
                for (i, cl) in state.read().await.poll.as_slice().into_iter().enumerate() {
                    if cl.id == client.id {
                        index = i as i16;
                        if let Some(id) = &cl.id_game {
                            in_game = true;
                            game_id = id.to_string();
                        }
                        break;
                    }
                }
                if index != -1 {
                    state.write().await.poll.swap_remove(index as usize);
                }
                if in_game {
                    let mut free_player_id = String::new();
                    for game in state.read().await.games.as_slice().into_iter() {
                        if game.id == game_id {
                            if let Some(player) = &game.player1 {
                                if player.id == client.id {
                                    if let Some(player2) = &game.player2 {
                                        free_player_id = player2.id.clone();
                                    }
                                } else if let Some(player3) = &game.player2 {
                                    if player3.id == client.id {
                                        if let Some(player1) = &game.player1 {
                                            free_player_id = player1.id.clone();
                                        }
                                    }
                                }
                            }
                            game.game_state.lock().await.finished = true;
                            let _ = game.tx.send("finish_him".to_owned());
                        }
                    }
                    for cl in state.write().await.poll.as_mut_slice() {
                        if cl.id == free_player_id {
                            cl.id_game = None;
                            break;
                        }
                    }
                }
            },
            _ => {
                println!("Unknown message");
            },
        }
    }
    for handle in join_handler {
        let _ = handle.await;
    }
}

#[tokio::main]
async fn main() {

    let clients_poll = Arc::new(RwLock::new(Clients {poll: vec![], games: vec![], bot_games: vec![]}));

    let app = Router::new()
        .route("/", get(websocket_handler))
        .with_state(clients_poll);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:4210")
        .await
        .expect("failed to bind ip address to the listener");

    axum::serve(listener, app)
        .await
        .expect("Failed to create server");
}
