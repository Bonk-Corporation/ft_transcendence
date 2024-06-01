mod input;

use std::{sync::Arc, time::SystemTime};
use futures::{sink::SinkExt, stream::StreamExt};
use axum::{
    extract::{WebSocketUpgrade, ws::{Message, WebSocket}, State},
    response::IntoResponse,
    Router,
    routing::get,
};
use input::*;
use tokio::sync::RwLock;

struct Clients {
    poll: Vec<Client>,
    games: Vec<Game>,
}

impl Clients {
    async fn add_client(&mut self, client: Client) -> Result<(), String> {

        for cl in self.poll.as_slice() {
            match cl.id.as_str() {
                num if num == client.id.clone()  => return Ok(()),//return Err("Client already in poll".to_string()),
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

    async fn start_solo_game(&mut self, client_id: String) -> String {
        println!("Solo game start");
        let game_id = uuid::Uuid::new_v4().to_string();
        for client in self.poll.as_mut_slice() {
            if client.id.as_str() == client_id {
                client.id_game = Some(game_id.clone());
                let mut game = Game::new(client.clone(), game_id.clone());
                let bot = Client {
                    id: uuid::Uuid::new_v4().to_string(),
                    name: "Bot".to_string(),
                    id_game: Some(game_id.to_string()),
                };
                game.add_player(bot.clone());
                self.games.push(game.clone());
                tokio::spawn(async move {
                    let winner = game.start().await;
                    match winner {
                        EndGame::Player1 => println!("Player won"),
                        EndGame::Player2 => println!("Bot won"),
                        EndGame::Draw => println!("Draw"),
                        EndGame::Undecided => println!("Undecided"),
                    }
                });
            }
        }
        game_id
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

#[derive(PartialEq)]
enum BotState {
    WAIT,
    ESTIMATE,
    PLAY,
}

struct BotGame {
    pub player          : Entity,
    pub bot             : Entity,
    pub ball            : Entity,
    pub last_move       : Movement,
    pub last_state      : BotState,
    pub move_time       : SystemTime,
    pub update_time     : SystemTime,
    pub preshot_delay   : f32,
    pub think_delay     : f32,
    pub pause_counter   : u8,
}

impl BotGame {
    fn new() -> Self {
        BotGame {
            player          : Entity::default(),
            bot             : Entity::default(),
            ball            : Entity::default(),
            last_move       : Movement::Static,
            last_state      : BotState::WAIT,
            move_time       : SystemTime::now(),
            update_time     : SystemTime::UNIX_EPOCH,
            preshot_delay   : 0.,
            think_delay     : 0.,
            pause_counter   : 0,
        }
    }

    async fn bot_turn(&mut self, game: Game) {
        let time_elapsed = self.move_time.elapsed().unwrap().as_millis();

        if BOT_SCRAP_TIME < self.update_time.elapsed().unwrap().as_millis() {
            self.player         = game.state.lock().await.player1_ent.clone();
            self.bot            = game.state.lock().await.player2_ent.clone();
            self.ball           = game.state.lock().await.ball_ent.clone();
            self.update_time    = SystemTime::now();
        } else {
            let mut time_credit = time_elapsed as u64;
            while PLAYER_MOVE_TIME < time_credit {
                if self.last_move == Movement::Up && !hit_top(&self.bot) {
                    self.bot.position.y += PLAYER_SPEED;
                } else if self.last_move == Movement::Down && !hit_bot(&self.bot) {
                    self.bot.position.y -= PLAYER_SPEED;
                }
                time_credit -= PLAYER_MOVE_TIME;
            }
            self.ball.position += self.ball.velocity;
            if hit_bounds(&self.ball) {
                self.ball.velocity.y = -self.ball.velocity.y;
            }
        }
        
        if self.ball.velocity.x <= 0. && 0. <= self.ball.position.x {
            self.bot_move(None, game).await;
            self.last_state = BotState::WAIT;
        } else if self.ball.velocity.x <= 0. {
            if self.last_state == BotState::WAIT {
                self.preshot_delay = rand::random::<f32>() * BOT_PRESHOT_DELAY + BOT_PRESHOT_MIN_DELAY;
            }
            if 0. < self.preshot_delay {
                self.preshot_delay -= time_elapsed as f32;
            }
            self.bot_move(None, game).await;
            self.last_state = BotState::ESTIMATE;
        } else {
            let mut ball_touch = (self.bot.position.x - self.ball.position.x - self.ball.width) / self.ball.velocity.x * self.ball.velocity.y + self.ball.position.y;
            let rebound_count = (ball_touch / WINDOW_HEIGHT).ceil();

            if rebound_count as i32 % 2 == 0 {
                ball_touch = WINDOW_HEIGHT - ball_touch;
            }
            ball_touch = ball_touch.rem_euclid(WINDOW_HEIGHT);

            let bot_reach_time =    if ball_touch < self.bot.position.y {
                                        (self.bot.position.y - ball_touch) / PLAYER_SPEED * PLAYER_MOVE_TIME as f32
                                    } else if self.bot.position.y + self.bot.height < ball_touch {
                                        (ball_touch - self.bot.position.y - self.bot.height) / PLAYER_SPEED * PLAYER_MOVE_TIME as f32
                                    } else {
                                        0.0
                                    };
            let ball_reach_time = (self.bot.position.x - self.ball.position.x) / (self.ball.velocity.x) * 1000. / FPS as f32;

            if BOT_MISS_TIME <= bot_reach_time - ball_reach_time {
                self.think_delay = 0.;
                self.preshot_delay = 0.;
            }

            if self.last_state == BotState::WAIT || self.last_state == BotState::ESTIMATE {
                self.think_delay = rand::random::<f32>() * BOT_DELAY_REBOUND_FACTOR * rebound_count * rebound_count;
                if self.last_state == BotState::WAIT {
                    self.preshot_delay = rand::random::<f32>() * BOT_PRESHOT_DELAY + BOT_PRESHOT_MIN_DELAY;
                }
            }
            if self.think_delay <= 0. {
                self.bot_move(Some(ball_touch), game).await;
            } else if self.preshot_delay <= 0. {
                self.think_delay -= time_elapsed as f32;
                self.bot_move(Some(WINDOW_HEIGHT / 2.), game).await;
            } else {
                self.preshot_delay -= time_elapsed as f32;
                self.think_delay -= time_elapsed as f32;
                self.bot_move(None, game).await;
            }
            self.last_state = BotState::PLAY;
        }
    }

    async fn    bot_move(&mut self, y_target: Option<f32>, game: Game)
    {
        let mut ai_move = Move {
            id          : game.player2.unwrap().id.clone(),
            game_id     : game.id.clone(),
            movement    : String::new()
        };

        let target_diff =   if let Some(y_target) = y_target {
                                y_target - self.bot.position.y
                            } else {
                                0.
                            };

        if self.pause_counter == 0 && target_diff < 0. && self.last_move != Movement::Down
        {
            if self.last_move == Movement::Static {
                ai_move.movement = String::from("DOWN");
                game.tx.send("MOVE ".to_owned() + &serde_json::to_string_pretty(&ai_move).unwrap()).unwrap();
                self.last_move = Movement::Down;
            } else {
                self.pause_counter = 1;
            }
        }
        if self.pause_counter == 0 && self.bot.height <= target_diff && self.last_move != Movement::Up
        {
            if self.last_move == Movement::Static {
                ai_move.movement = String::from("UP");
                game.tx.send("MOVE ".to_owned() + &serde_json::to_string_pretty(&ai_move).unwrap()).unwrap();
                self.last_move = Movement::Up;
            } else {
                self.pause_counter = 1;
            }
        }
        if 0 < self.pause_counter || (0. <= target_diff && target_diff <= self.bot.height && self.last_move != Movement::Static)
        {
            if self.pause_counter == BOT_PAUSE {
                self.pause_counter = 0;
            }
            ai_move.movement = self.last_move.to_string();
            game.tx.send("SMOVE".to_owned() + &serde_json::to_string_pretty(&ai_move).unwrap()).unwrap();
            self.last_move = Movement::Static;
            if 0 < self.pause_counter {
               self.pause_counter += 1;
            }
        }
        self.move_time = SystemTime::now();
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
                    "SMOVE" => {
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
                            id_game: None
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
                            if let Ok(game) = cl_state.read().await.get_game(game_id.clone().unwrap()).await {
                                if let Err(err) = ptr_ws.write().await.send(Message::Text("PLYONE".to_owned() + &game.player1.unwrap().id)).await {
                                    println!("{err}");
                                } else {
                                    println!("PLYONE sent");                                
                                }
                                tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
                            } else {
                                println!("error");
                            }
                            loop  {
                                tokio::time::sleep(tokio::time::Duration::from_millis(1000 / FPS)).await;
                                let game = cl_state.read().await.get_game(game_id.clone().unwrap()).await.unwrap();
                                if game.state.lock().await.ball_ent.velocity.x != 0. {
                                    game.state.lock().await.update_ball();
                                    game.state.lock().await.update_score();
                                    match ptr_ws.write().await.send(Message::Text("UPDATE".to_owned() + &serde_json::to_string(&(*game.state.lock().await)).unwrap())).await {
                                        Ok(_) => (),
                                        Err(_) => return,
                                    };
                                }
                                if game.state.lock().await.finished {
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
                    "SOLO " => {
                        let on_connect: OnConnectClient = serde_json::from_str(&text[5..]).unwrap();
                        let client = Client {
                            id: on_connect.id,
                            name: "Player".to_string(),
                            id_game: None,
                        };
                        let game_id = state.write().await.start_solo_game(client.id).await;
                        sender.write().await.send(Message::Text("GAMEID".to_owned() + &game_id)).await.unwrap();
                        let cl_state = Arc::clone(&state);
                        let ptr_ws = Arc::clone(&sender);
                        join_handler.push(tokio::spawn(async move {
                            let mut botgame = BotGame::new();

                            loop  {
                                if let Err(_) = cl_state.read().await.get_game(game_id.clone()).await {
                                    break;
                                }
                                tokio::time::sleep(tokio::time::Duration::from_millis(1000 / FPS)).await;
                                let game = cl_state.read().await.get_game(game_id.clone()).await.unwrap();
                                if game.state.lock().await.ball_ent.velocity.x != 0. {
                                    game.state.lock().await.update_ball();
                                    game.state.lock().await.update_score();
                                    match ptr_ws.write().await.send(Message::Text("UPDATE".to_owned() + &serde_json::to_string(&(*game.state.lock().await)).unwrap())).await {
                                        Ok(_) => (),
                                        Err(_) => return,
                                    };
                                }

                                if game.state.lock().await.finished {
                                    let player1_id = if let Ok(game) = cl_state.read().await.get_game(game_id.clone()).await {
                                        game.player1.unwrap().id
                                    } else {
                                        return;
                                    };
                                    let player2_id = if let Ok(game) = cl_state.read().await.get_game(game_id.clone()).await {
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

                                botgame.bot_turn(game).await;
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
                            game.state.lock().await.finished = true;
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

    let clients_poll = Arc::new(RwLock::new(Clients {poll: vec![], games: vec![]}));

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
