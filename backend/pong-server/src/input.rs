use serde::{
    Serialize,
    Deserialize,
};
use tokio::sync::broadcast;
use glam::Vec2;
use std::sync::Arc;
use futures::lock::Mutex;

pub const FPS                       : u64   = 60;
pub const WINDOW_WIDTH              : f32   = 1920.;
pub const WINDOW_HEIGHT             : f32   = 1440.;

pub const PLAYER_WIDTH              : f32   = WINDOW_WIDTH * 0.04;
pub const PLAYER_HEIGHT             : f32   = WINDOW_HEIGHT * 0.3;
pub const PLAYER_MARGIN             : f32   = WINDOW_WIDTH * 0.02;
pub const PLAYER_MOVE_TIME          : u64   = 8;

pub const BALL_WIDTH                : f32   = PLAYER_WIDTH;
pub const BALL_HEIGHT               : f32   = BALL_WIDTH;

pub const PLAYER_SPEED              : f32   = WINDOW_HEIGHT / 100.;
pub const PLAYER_SPIN               : f32   = WINDOW_HEIGHT / 100.;

pub const BALL_SPEED                : f32   = WINDOW_WIDTH / 200.;
pub const BALL_ACCELERTION          : f32   = BALL_SPEED / 32.;
pub const MAX_BALL_SPEED            : f32   = BALL_SPEED * 2.;

pub const MAX_SCORE                 : u8    = 5;

pub const BOT_SCRAP_TIME            : u128  = 1000;
pub const BOT_MISS_TIME             : f32   = 200.;
pub const BOT_PRESHOT_MIN_DELAY     : f32   = 1000.;
pub const BOT_PRESHOT_DELAY         : f32   = 1000.;
pub const BOT_DELAY_REBOUND_FACTOR  : f32   = 500.;
pub const BOT_PAUSE                 : u8    = 2;

#[derive(Clone)]
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

#[derive(Clone, Deserialize, Serialize)]
pub struct Entity {
    pub width       : f32,
    pub height      : f32,
    pub position    : Vec2,
    pub velocity    : Vec2,
}

impl Entity {
    pub fn new(width: f32, height: f32, position: Vec2) -> Entity {
        Entity {width, height, position, velocity: Vec2{ x: 0., y: 0. }}
    }

    pub fn default() -> Self {
        Entity {
            width       : 0.0,
            height      : 0.0,
            position    : Vec2::new(0.0, 0.0),
            velocity    : Vec2::new(0.0, 0.0)
        }
    }
    
    pub fn with_velocity(width: f32, height: f32, position: Vec2, velocity: Vec2) -> Entity {
        Entity {width, height, position, velocity}
    }

    pub fn intersects(&self, other: &Entity) -> bool
    {
        self.position.x <= other.position.x + other.width
            && self.position.x + self.width >= other.position.x
            && self.position.y <= other.position.y + other.height
            && self.position.y + self.height >= other.position.y
    }

    fn center(&self) -> Vec2 {
        Vec2 {
            x: self.position.x + (self.width / 2.),
            y: self.position.y + (self.height / 2.),
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct GameState {
    pub player1_ent : Entity,
    pub player2_ent : Entity,
    pub ball_ent    : Entity,
    score           : (u8, u8),
    pub winner      : EndGame,
    pub finished    : bool,
}

#[derive(Clone, Copy, Serialize, Deserialize)]
pub enum EndGame {
    Player1,
    Player2,
    Draw,
    Undecided,
}

pub fn hit_bounds(entity: &Entity) -> bool {
    hit_bot(entity) || hit_top(entity)
}

pub fn hit_bot(entity: &Entity) -> bool {
    entity.position.y <= 0.
}

pub fn hit_top(entity: &Entity) -> bool {
    entity.position.y + entity.height >= WINDOW_HEIGHT
}

impl GameState {
    pub fn new() -> GameState {
        let player1_pos     = Vec2::new(PLAYER_MARGIN, (WINDOW_HEIGHT - PLAYER_HEIGHT) / 2.);
        let player2_pos     = Vec2::new(WINDOW_WIDTH - PLAYER_WIDTH - PLAYER_MARGIN, (WINDOW_HEIGHT - PLAYER_HEIGHT) / 2.);
        let ball_pos        = Vec2::new((WINDOW_WIDTH - BALL_WIDTH) / 2., (WINDOW_HEIGHT - BALL_HEIGHT) / 2.);
        let ball_velocity   = Vec2::new(-BALL_SPEED, 0.);
        GameState {
            player1_ent : Entity::new(PLAYER_WIDTH, PLAYER_HEIGHT, player1_pos),
            player2_ent : Entity::new(PLAYER_WIDTH, PLAYER_HEIGHT, player2_pos),
            ball_ent    : Entity::with_velocity(BALL_WIDTH, BALL_HEIGHT, ball_pos, ball_velocity),
            score       : (0, 0),
            winner      : EndGame::Undecided,
            finished    : false,
        }
    }

    pub fn none() -> GameState {
        GameState {
            player1_ent : Entity::new(0.,0.,Vec2{x: 0., y: 0.}),
            player2_ent : Entity::new(0.,0.,Vec2{x: 0., y: 0.}),
            ball_ent    : Entity::new(0.,0.,Vec2{x: 0., y: 0.}),
            score       : (0,0),
            winner      : EndGame::Undecided,
            finished    : false,
        }
    }

    pub fn reset(&mut self) -> &mut Self {
        let player1_pos     = Vec2::new(PLAYER_MARGIN, (WINDOW_HEIGHT - PLAYER_HEIGHT) / 2.);
        let player2_pos     = Vec2::new(WINDOW_WIDTH - PLAYER_WIDTH - PLAYER_MARGIN, (WINDOW_HEIGHT - PLAYER_HEIGHT) / 2.);
        let ball_pos        = Vec2::new((WINDOW_WIDTH - BALL_WIDTH) / 2., (WINDOW_HEIGHT - BALL_HEIGHT) / 2.);
        let ball_velocity   = Vec2::new(-BALL_SPEED, 0.);
        self.player1_ent    = Entity::new(PLAYER_WIDTH, PLAYER_HEIGHT, player1_pos);
        self.player2_ent    = Entity::new(PLAYER_WIDTH, PLAYER_HEIGHT, player2_pos);
        self.ball_ent       = Entity::with_velocity(BALL_WIDTH, BALL_HEIGHT, ball_pos, ball_velocity);
        self
    }

    fn update_player(&mut self, player_num: u8, input: String) {
        if player_num == 1 {
            if &input == "UP" && !hit_top(&self.player1_ent) {
                self.player1_ent.position.y += PLAYER_SPEED;
            } else if &input == "DOWN" && !hit_bot(&self.player1_ent) {
                self.player1_ent.position.y -= PLAYER_SPEED;
            }
        } else {
            if &input == "UP" && !hit_top(&self.player2_ent) {
                self.player2_ent.position.y += PLAYER_SPEED;
            } else if &input == "DOWN" && !hit_bot(&self.player2_ent) {
                self.player2_ent.position.y -= PLAYER_SPEED;
            }
        }
    }

    pub fn update_ball(&mut self) {
        self.ball_ent.position.x += self.ball_ent.velocity.x;
        self.ball_ent.position.y += self.ball_ent.velocity.y;

        let paddle_hit = if self.ball_ent.intersects(&self.player1_ent) {
            if self.ball_ent.velocity.x <= 0. {
                self.ball_ent.velocity.x = -(self.ball_ent.velocity.x + (BALL_ACCELERTION * self.ball_ent.velocity.x.signum()));
            }
            Some(&self.player1_ent)
        } else if self.ball_ent.intersects(&self.player2_ent) {
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
        if hit_bounds(&self.ball_ent) {
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
            self.score.1 += 1;
            self.reset();
        } else if self.ball_ent.position.x > WINDOW_WIDTH {
            self.score.0 += 1;
            self.reset();
        }
    }
}

#[derive(Clone)]
pub struct Game {
    pub player1 : Option<Client>,
    pub player2 : Option<Client>,
    pub id      : String,
    pub tx      : broadcast::Sender<String>,
    pub state   : Arc<Mutex<GameState>>,
}

#[derive(PartialEq)]
pub enum Movement {
    Up,
    Down,
    Static,
}

impl Movement {
    pub fn to_string(&self) -> String {
        match *self {
            Movement::Static => "STOP",
            Movement::Down => "DOWN",
            Movement::Up => "UP"
        }.to_string()
    }
}

impl Game {
    pub fn new(player1: Client, id: String) -> Game {
        let (tx, _rx) = broadcast::channel(2);
        Game {
            player1: Some(player1),
            player2: None,
            tx,
            id,
            state: Arc::new(Mutex::new(GameState::none())),
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
        *self.state.lock().await = GameState::new();
        let mut player_moves = vec![];
        let game_on = Arc::new(Mutex::new(true));
        let p1_moves = Arc::new(Mutex::new(Movement::Static));
        let p2_moves = Arc::new(Mutex::new(Movement::Static));
        let p1_moves_cl = p1_moves.clone();
        let game_on_cl = game_on.clone();
        let cl_state = self.state.clone();
        player_moves.push(tokio::spawn(async move {
            while *game_on_cl.lock().await {
                tokio::time::sleep(tokio::time::Duration::from_millis(PLAYER_MOVE_TIME)).await;
                match  *p1_moves_cl.lock().await {
                    Movement::Static  => (),
                    Movement::Up => cl_state.lock().await.update_player(1, "UP".to_owned()),
                    Movement::Down => cl_state.lock().await.update_player(1, "DOWN".to_owned()),
                }
            }
        }));
        let p2_moves_cl = p2_moves.clone();
        let game_on_cl = game_on.clone();
        let cl_state = self.state.clone();
        player_moves.push(tokio::spawn(async move {
            while *game_on_cl.lock().await {
                tokio::time::sleep(tokio::time::Duration::from_millis(PLAYER_MOVE_TIME)).await;
                match  *p2_moves_cl.lock().await {
                    Movement::Static  => (),
                    Movement::Up => cl_state.lock().await.update_player(2, "UP".to_owned()),
                    Movement::Down =>cl_state.lock().await.update_player(2, "DOWN".to_owned()),
                }
            }
        }));
        while let Ok(msg) = rx.recv().await {
            let movement: Result<Move, serde_json::Error> = serde_json::from_str(&msg[5..]);
            let r#move = "SMOVE" == &msg[0..5];
            if let Ok(movement) = movement {
                match (self.player1.clone(), self.player2.clone()) {
                    (_, None) | (None, _) => break, //a player has left the game
                    (Some(player1), Some(player2)) => {
                        match r#move {
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
            if self.state.lock().await.finished {
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
            (p1, p2) = self.state.lock().await.score;
        }
        if p1 > p2 {
            self.state.lock().await.winner = EndGame::Player1;
        } else if p1 < p2 {
            self.state.lock().await.winner = EndGame::Player2;
        } else {
            self.state.lock().await.winner = EndGame::Draw;
        }
        self.state.lock().await.winner
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
