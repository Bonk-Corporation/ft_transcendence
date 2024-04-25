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
                            game_id = Some(game.id.clone());
                            client.id_game = Some(game_id.as_ref().unwrap().clone());
                            game.add_player(client.clone());
                            if game.is_full() {
                                let mut game_clone = game.clone();
                                tokio::spawn(async move {
                                    let winner = game_clone.start().await;
                                    println!("{} won", winner);
                                });
                            }
                            break;
                        }
                    }
                    if None == client.id_game {
                        game_id = Some(uuid::Uuid::new_v4().to_string());
                        self.games.push(Game::new(client.clone(), game_id.as_ref().unwrap().clone()));
                        client.id_game = Some(game_id.as_ref().unwrap().clone());
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
                        println!("{} won", winner);
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
                        game.tx.send("SMOVE".to_owned() + &serde_json::to_string_pretty(&movement).unwrap())
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
                            println!("move succeded");
                        }
                    },
                    "SMOVE" => {
                        let movement: Move = serde_json::from_str(&text[5..]).unwrap();
                        if let Ok(_) = state.read().await.stop_move(movement).await {
                            println!("stop move succeded");
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
                for (i, cl) in state.read().await.poll.as_slice().into_iter().enumerate() {
                    if cl.id == client.id {
                        if let Some(game_id) = &cl.id_game { 
                            match state.read().await.get_game(game_id.to_string()).await.unwrap().tx.send("STOP ".to_owned()) {
                                Err(err) => println!("Err while client Disconnected: {}", err),
                                Ok(_) => {
                                    for (j, game) in state.read().await.games.as_slice().into_iter().enumerate() {
                                        if game.id == *game_id {
                                            state.write().await.games.swap_remove(j);
                                            break;
                                        }
                                    }
                                }
                            };
                        }
                        state.write().await.poll.swap_remove(i);
                        break;
                    }
                }
                break;
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

    let listener = tokio::net::TcpListener::bind("0.0.0.0:6969")
        .await
        .expect("failed to bind ip adress to the listener");

    axum::serve(listener, app)
        .await
        .expect("Failed to create server");
}
