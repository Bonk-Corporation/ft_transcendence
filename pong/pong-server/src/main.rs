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
    Move,
    Game,
    Client,
    OnConnectClient
};
use tokio::sync::RwLock;

#[derive(Debug)]
struct Clients {
    poll: Vec<Client>,
    games: Vec<Game>,
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
                    println!("{:?}", self.games);
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
                        {
                            println!("before");
                            self.games.push(Game::new(client.clone(), game_id.as_ref().unwrap().clone()));
                            print!("after");
                        }
                        client.id_game = Some(game_id.as_ref().unwrap().clone());
                        println!("create new game in: {:?}", self.games);
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
}
async fn websocket_handler(State(state): State<Arc<RwLock<Clients>>>, ws: WebSocketUpgrade) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(state, socket))
}

async fn handle_socket(state: Arc<RwLock<Clients>>, socket: WebSocket) {
    let (sender, mut receiver) = socket.split();
    let sender = Arc::new(RwLock::new(sender));
    let mut join_handler = vec![];
    while let Some(Ok(msg)) = receiver.next().await {
        match msg {
            Message::Text(text) => {
                println!("Got message from client: {}", text);
                match &text[0..5] {
                    "NEW  " => {
                        let on_connect: OnConnectClient = serde_json::from_str(&text[5..]).unwrap();
                        let client = Client {
                            id: on_connect.id,
                            username: on_connect.username,
                            id_game: None,
                        };
                        state.write().await.add_client(client.clone()).await.unwrap();
                        sender.write().await.send(Message::Text(format!("{} added to poll | id: {}", client.username, client.id)))
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
                    "START" => {
                        let on_connect: OnConnectClient = serde_json::from_str(&text[5..]).unwrap();
                        let client = Client {
                            id: on_connect.id,
                            username: on_connect.username,
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
                    _ => {
                        sender.write().await.send(Message::Text("Unknown command".to_string()))
                            .await
                            .unwrap();
                    },
                }
            },
            Message::Close(_) => {
                println!("Client Disconnected...");
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

    let clients_poll = Arc::new(RwLock::new(Clients {poll: vec![], games: vec![]}));

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
