use serde::{
    Serialize,
    Deserialize,
};
use tokio::sync::broadcast;
use mint::Vector2;
use std::sync::Arc;
use futures::lock::Mutex;

const WINDOW_WIDTH: f32 = 640.;
const WINDOW_HEIGHT: f32 = 480.;

const PLAYER_WIDTH: f32 = WINDOW_WIDTH * 0.1;
const PLAYER_HEIGHT: f32 = WINDOW_HEIGHT * 0.35;

const PLAYER_SPEED: f32 = 5.;
const PLAYER_SPIN: f32 = 4.;

const BALL_SPEED: f32 = 8.;
const BALL_ACCELERTION: f32 = 0.1;
const MAX_BALL_SPEED: f32 = 20.;

const MAX_SCORE: u8 = 5;

#[derive(Clone, Debug)]
pub struct Client {
   pub id: String,
   pub name: String,
   pub id_game: Option<String>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct OnConnectClient {
    pub id: String,
    pub username: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Move {
    pub id: String,
    pub game_id: String,
    pub movement: String,
}

struct Rectangle {
    pub x: f32,
    pub y: f32,
    width: f32,
    height: f32,
}

impl Rectangle {
    pub fn intersects(&self, other: &Rectangle) -> bool
    {
        self.x <= other.x + other.width
            && self.x + self.width >= other.x
            && self.y <= other.y + other.height
            && self.y + self.height >= other.y
    }
}

#[derive(Clone, Deserialize, Serialize)]
pub struct Entity {
    width: f32,
    height: f32,
    position: Vector2<f32>,
    pub velocity: Vector2<f32>,
}

impl Entity {
    pub fn new(width: f32, height: f32, position: Vector2<f32>) -> Entity {
        Entity {width, height, position, velocity: Vector2{ x: 0., y: 0. }}
    }
    
    pub fn with_velocity(width: f32, height: f32, position: Vector2<f32>, velocity: Vector2<f32>) -> Entity {
        Entity {width, height, position, velocity}
    }

    fn bounds(&self) -> Rectangle {
        Rectangle {
            x: self.position.x,
            y: self.position.y,
            width: self.width,
            height: self.height,
        }
    }

    fn center(&self) -> Vector2<f32> {
        Vector2 {
            x: self.position.x + (self.width / 2.),
            y: self.position.y + (self.height / 2.),
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct GameState {
    player1_ent : Entity,
    player2_ent : Entity,
    pub ball_ent: Entity,
    score       : (u8, u8),
    pub winner: EndGame,
    pub finished: bool,
}

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub enum EndGame {
    Player1,
    Player2,
    Draw,
    Undecided,
}

impl GameState {
    pub fn new() -> GameState {
        let player1_pos = Vector2 {
            x: 16.,
            y: (WINDOW_HEIGHT - PLAYER_HEIGHT) / 2.,
        };
        let player2_pos = Vector2 {
            x: WINDOW_WIDTH - PLAYER_WIDTH - 16.,
            y: (WINDOW_HEIGHT - PLAYER_HEIGHT) / 2.,
        };
        let ball_pos = Vector2 {
            x: (WINDOW_WIDTH - 0.05) / 2.,
            y: (WINDOW_HEIGHT - 0.05) / 2.,
        };
        let ball_velocity = Vector2 {
            x: -BALL_SPEED,
            y: 0.,
        };
        GameState {
            player1_ent : Entity::new(PLAYER_WIDTH, PLAYER_HEIGHT, player1_pos),
            player2_ent : Entity::new(PLAYER_WIDTH, PLAYER_HEIGHT, player2_pos),
            ball_ent    : Entity::with_velocity(0.05, 0.05, ball_pos, ball_velocity),
            score       : (0, 0),
            winner: EndGame::Undecided,
            finished: false,
        }
    }

    pub fn none() -> GameState {
        GameState {
            player1_ent : Entity::new(0.,0.,Vector2{x: 0., y: 0.}),
            player2_ent : Entity::new(0.,0.,Vector2{x: 0., y: 0.}),
            ball_ent    : Entity::new(0.,0.,Vector2{x: 0., y: 0.}),
            score       : (0,0),
            winner: EndGame::Undecided,
            finished: false,
        }
    }

    fn hit_bounds(&self, entity: &Entity) -> bool {
        self.hit_bot(entity) || self.hit_top(entity)
    }

    fn hit_bot(&self, entity: &Entity) -> bool {
        entity.position.y <= 0.
    }

    fn hit_top(&self, entity: &Entity) -> bool {
        entity.position.y + entity.height >= WINDOW_HEIGHT
    }

    fn update_player(&mut self, player_num: u8, input: String) {
        if player_num == 1 {
            if &input == "UP" && !self.hit_top(&self.player1_ent) {
                self.player1_ent.position.y += PLAYER_SPEED;
            } else if &input == "DOWN" && !self.hit_bot(&self.player1_ent) {
                self.player1_ent.position.y -= PLAYER_SPEED;
            }
        } else {
            if &input == "UP" && !self.hit_top(&self.player2_ent) {
                self.player2_ent.position.y += PLAYER_SPEED;
            } else if &input == "DOWN" && !self.hit_bot(&self.player2_ent) {
                self.player2_ent.position.y -= PLAYER_SPEED;
            }
        }
    }

    pub fn update_ball(&mut self) {
        self.ball_ent.position.x += self.ball_ent.velocity.x;
        self.ball_ent.position.y += self.ball_ent.velocity.y;

        let paddle_hit = if self.ball_ent.bounds().intersects(&self.player1_ent.bounds()) {
            if self.ball_ent.velocity.x <= 0. {
                self.ball_ent.velocity.x = -(self.ball_ent.velocity.x + (BALL_ACCELERTION * self.ball_ent.velocity.x.signum()));
            }
            Some(&self.player1_ent)
        } else if self.ball_ent.bounds().intersects(&self.player2_ent.bounds()) {
            if self.ball_ent.velocity.x >= 0. {
                self.ball_ent.velocity.x = -(self.ball_ent.velocity.x + (BALL_ACCELERTION * self.ball_ent.velocity.x.signum()));
            }
            Some(&self.player2_ent)
        } else {
            None
        };

        if let Some(player) = paddle_hit {
            if self.ball_ent.velocity.x.signum() > MAX_BALL_SPEED {
                self.ball_ent.velocity.x = if self.ball_ent.velocity.x > 0. {
                    MAX_BALL_SPEED
                } else {
                    -MAX_BALL_SPEED
                };
            }
            
            let offset = (player.center().y - self.ball_ent.center().y) / player.height;
            self.ball_ent.velocity.y += PLAYER_SPIN * -offset;
        }
        if self.hit_bounds(&self.ball_ent) {
            self.ball_ent.velocity.y = -self.ball_ent.velocity.y;
        }
    }

    pub fn update_score(&mut self) {
        let (p1, p2) =  self.score;
        self.winner = if p1 >= MAX_SCORE {
            self.finished = true;
            EndGame::Player1
        } else if p2 >= MAX_SCORE {
            self.finished = true;
            EndGame::Player2
        } else {
            EndGame::Undecided
        };
        if self.ball_ent.position.x < 0. {
            let (player1_score, player2_score) = self.score;
            self.score = (player1_score, player2_score + 1);
            self.player1_ent.position = Vector2 {
                x: 16.,
                y: (WINDOW_HEIGHT - PLAYER_HEIGHT) / 2.,
            };
            self.player2_ent.position = Vector2 {
                x: WINDOW_WIDTH - PLAYER_WIDTH - 16.,
                y: (WINDOW_HEIGHT - PLAYER_HEIGHT) / 2.,
            };
            self.ball_ent.position = Vector2 {
                x: (WINDOW_WIDTH - 0.05) / 2.,
                y: (WINDOW_HEIGHT - 0.05) / 2.,
            };
            self.ball_ent.velocity = Vector2 {
                x: -BALL_SPEED,
                y: 0.,
            };
        } else if self.ball_ent.position.x > WINDOW_WIDTH {
            let (player1_score, player2_score) = self.score;
            self.score = (player1_score + 1, player2_score);
            self.player1_ent.position = Vector2 {
                x: 16.,
                y: (WINDOW_HEIGHT - PLAYER_HEIGHT) / 2.,
            };
            self.player2_ent.position = Vector2 {
                x: WINDOW_WIDTH - PLAYER_WIDTH - 16.,
                y: (WINDOW_HEIGHT - PLAYER_HEIGHT) / 2.,
            };
            self.ball_ent.position = Vector2 {
                x: (WINDOW_WIDTH - 0.05) / 2.,
                y: (WINDOW_HEIGHT - 0.05) / 2.,
            };
            self.ball_ent.velocity = Vector2 {
                x: -BALL_SPEED,
                y: 0.,
            };
        }
    }
}

#[derive(Clone, Debug)]
pub struct Game {
    pub player1: Option<Client>,
    pub player2: Option<Client>,
    pub id: String,
    pub tx: broadcast::Sender<String>,
    pub game_state: Arc<Mutex<GameState>>,
}

pub enum Movement {
    Up,
    Down,
    Static,
}

impl Game {
    pub fn new(player1: Client, id: String) -> Game {
        let (tx, _rx) = broadcast::channel(2);
        Game {
            player1: Some(player1),
            player2: None,
            tx,
            id,
            game_state: Arc::new(Mutex::new(GameState::none())),
        } 
    }
    
    pub fn new_solo(player1: Client, ai: Client, id: String) -> Game {
        let (tx, _rx) = broadcast::channel(2);
        Game {
            player1: Some(player1),
            player2: Some(ai),
            tx,
            id,
            game_state: Arc::new(Mutex::new(GameState::none())),
        } 
    }

    pub fn is_full(&self) -> bool {
        match (self.player1.clone(), self.player2.clone()) {
            (_, None) | (None, _) => false,
            _ => true,
        }
    }

    pub async fn start(&mut self) -> EndGame {
        let mut rx = self.tx.subscribe();
        *self.game_state.lock().await = GameState::new();
        let mut player_moves = vec![];
        let game_on = Arc::new(Mutex::new(true));
        let p1_moves = Arc::new(Mutex::new(Movement::Static));
        let p2_moves = Arc::new(Mutex::new(Movement::Static));
        let p1_moves_cl = p1_moves.clone();
        let game_on_cl = game_on.clone();
        let cl_state = self.game_state.clone();
        player_moves.push(tokio::spawn(async move {
            while *game_on_cl.lock().await {
                tokio::time::sleep(tokio::time::Duration::from_millis(8)).await;
                match  *p1_moves_cl.lock().await {
                    Movement::Static  => (),
                    Movement::Up => cl_state.lock().await.update_player(1, "UP".to_owned()),
                    Movement::Down => cl_state.lock().await.update_player(1, "DOWN".to_owned()),
                }
            }
        }));
        let p2_moves_cl = p2_moves.clone();
        let game_on_cl = game_on.clone();
        let cl_state = self.game_state.clone();
        player_moves.push(tokio::spawn(async move {
            while *game_on_cl.lock().await {
                tokio::time::sleep(tokio::time::Duration::from_millis(8)).await;
                match  *p2_moves_cl.lock().await {
                    Movement::Static  => (),
                    Movement::Up => cl_state.lock().await.update_player(2, "UP".to_owned()),
                    Movement::Down =>cl_state.lock().await.update_player(2, "DOWN".to_owned()),
                }
            }
        }));
        while let Ok(msg) = rx.recv().await {
            let movement: Result<Move, serde_json::Error> = serde_json::from_str(&msg[5..]);
            let smove = "SMOVE" == &msg[0..5];
            if let Ok(movement) = movement {
                match (self.player1.clone(), self.player2.clone()) {
                    (_, None) | (None, _) => break, //a player has left the game
                    (Some(player1), Some(player2)) => {
                        match smove {
                            true => if movement.id == player1.id {
                                *p1_moves.lock().await = Movement::Static;
                            } else {
                                *p2_moves.lock().await = Movement::Static;
                            },
                            false => match movement.movement.as_str() {
                                "UP" if movement.id == player1.id => *p1_moves.lock().await = Movement::Up,
                                "DOWN" if movement.id == player1.id => *p1_moves.lock().await = Movement::Down,
                                "UP" if movement.id == player2.id => *p2_moves.lock().await = Movement::Up,
                                "DOWN" if movement.id == player2.id => *p2_moves.lock().await = Movement::Down,
                                _ => (),
                            },
                        }
                    }
                }
            }
            if self.game_state.lock().await.finished {
                break;
            }
        }
        *game_on.lock().await = false;
        for moves in player_moves {
            let _ = moves.await;
        }
        let p1;
        let p2;
        {
            (p1, p2) = self.game_state.lock().await.score;
        }
        if p1 > p2 {
            self.game_state.lock().await.winner = EndGame::Player1;
        } else if p1 < p2 {
            self.game_state.lock().await.winner = EndGame::Player2;
        } else {
            self.game_state.lock().await.winner = EndGame::Draw;
        }
        self.game_state.lock().await.winner
    }

    pub fn add_player(&mut self, client: Client) {
        match (self.player1.clone(), self.player2.clone()) {
            (_, None) => {
                println!("player {} added to {}", client.id, self.id);
                self.player2 = Some(client);
            },
            (None, _) => {
                println!("player {} added to {}", client.id, self.id);
                self.player1 = Some(client);
            },
            _ => println!("player not added"),
        }
    }
}
