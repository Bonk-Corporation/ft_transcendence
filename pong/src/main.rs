use tetra::{
    Context,
    ContextBuilder,
    State,
    graphics::{self, Color, Rectangle, Texture},
    input::{self, Key},
    math::Vec2,
    window,
};

const WINDOW_WIDTH: f32 = 640.0;
const WINDOW_HEIGHT: f32 = 480.0;

const PADDLE_SPEED: f32 = 8.0;
const PADDLE_SPIN: f32 = 4.0;

const BALL_SPEED: f32 = 5.0;
const BALL_ACC: f32 = 0.05;

struct Entity {
    texture: Texture,
    position: Vec2<f32>,
    velocity: Vec2<f32>,
}

impl Entity {
    pub fn new(texture: Texture, position: Vec2<f32>) -> Entity {
        Entity { texture, position, velocity: Vec2::zero() }
    }

    pub fn with_velocity(texture: Texture, position: Vec2<f32>, velocity: Vec2<f32>) -> Entity {
        Entity { texture, position, velocity }
    }

    fn width(&self) -> f32 {
        self.texture.width() as f32
    }

    fn height(&self) -> f32 {
        self.texture.height() as f32
    }

    fn bounds(&self) -> Rectangle {
        Rectangle::new(
            self.position.x,
            self.position.y,
            self.width(),
            self.height(),
        )
    }

    fn center(&self) -> Vec2<f32> {
        Vec2::new(
            self.position.x + (self.width() / 2.0),
            self.position.y + (self.height() / 2.0),
        )
    }
}

struct GameState {
    player1: Entity,
    player2: Entity,
    ball   : Entity,
}

impl GameState {
    fn new(context: &mut Context) -> tetra::Result<GameState> {
        let paddle_texture1 = Texture::new(context, "./assets/PongPaddle.jpg")?;
        let paddle_position1 = Vec2::new(16.0, (WINDOW_HEIGHT - paddle_texture1.height() as f32) / 2.0);
        
        let paddle_texture2 = Texture::new(context, "./assets/PongPaddle.jpg")?;
        let paddle_position2 = Vec2::new(WINDOW_WIDTH - paddle_texture2.width() as f32 - 16.0, (WINDOW_HEIGHT - paddle_texture2.height() as f32) / 2.0);

        let ball_texture = Texture::new(context, "./assets/Ball.png")?;
        let ball_position = Vec2::new((WINDOW_WIDTH - ball_texture.height() as f32) / 2.0, (WINDOW_HEIGHT - ball_texture.height() as f32) / 2.0);
        let ball_velocity = Vec2::new(-BALL_SPEED, 0.0);

        Ok(GameState { 
            player1: Entity::new(paddle_texture1, paddle_position1),
            player2: Entity::new(paddle_texture2, paddle_position2),
            ball: Entity::with_velocity(ball_texture, ball_position, ball_velocity),
        })
    }

    fn hit_bounds(&self, entity: &Entity) -> bool {
        self.hit_bot(entity) || self.hit_top(entity)
    }

    fn hit_top(&self, entity: &Entity) -> bool {
        entity.position.y <= 0.0
    }

    fn hit_bot(&self, entity: &Entity) -> bool {
        entity.position.y + entity.height() >= WINDOW_HEIGHT
    }
}

impl State for GameState {
    fn update(&mut self, context: &mut Context) -> tetra::Result {
        //TODO: CREATE A CLIENT SIDE THAT WILL TELL THE BACK END WHAT MOVE THE PLAYER HAS DONE
        if input::is_key_down(context, Key::W) && !self.hit_top(&self.player1) {
            self.player1.position.y -= PADDLE_SPEED;
        }

        if input::is_key_down(context, Key::S) && !self.hit_bot(&self.player1) {
            self.player1.position.y += PADDLE_SPEED;
        }
        
        if input::is_key_down(context, Key::Up) && !self.hit_top(&self.player2) {
            self.player2.position.y -= PADDLE_SPEED;
        }

        if input::is_key_down(context, Key::Down) && !self.hit_bot(&self.player2) {
            self.player2.position.y += PADDLE_SPEED;
        }
        
        self.ball.position += self.ball.velocity;

        let paddle_hit = if self.ball.bounds().intersects(&self.player1.bounds()) {
                Some(&self.player1)
            } else if self.ball.bounds().intersects(&self.player2.bounds()) {
                Some(&self.player2)
            } else {
                None
            };
        
        if let Some(paddle) = paddle_hit {
            self.ball.velocity.x = -(self.ball.velocity.x + (BALL_ACC * self.ball.velocity.x.signum()));

            let offset = (paddle.center().y - self.ball.center().y) / paddle.height();
            self.ball.velocity.y += PADDLE_SPIN * -offset;
        }
        if self.hit_bounds(&self.ball) {
            self.ball.velocity.y = -self.ball.velocity.y;
        }

        //TODO: IMPROVE THE SCORE LOGIC
        if self.ball.position.x < 0.0 {
            window::quit(context);
            println!("Player 2 wins!");
        }

        if self.ball.position.x > WINDOW_WIDTH {
            window::quit(context);
            println!("Player 1 wins!");
        }

        Ok(())
    }

    fn draw(&mut self, context: &mut Context) -> tetra::Result {
        graphics::clear(context, Color::rgb(0., 0., 0.));
        
        self.player1.texture.draw(context, self.player1.position);
        self.player2.texture.draw(context, self.player2.position);
        self.ball.texture.draw(context, self.ball.position);

        Ok(())
    }
}

fn main() -> tetra::Result {
    ContextBuilder::new("PONG", WINDOW_WIDTH as i32, WINDOW_HEIGHT as i32)
        .quit_on_escape(true)
        .build()?
        .run(GameState::new)
}
