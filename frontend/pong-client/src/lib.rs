mod render;
mod game;

use std::{rc::Rc, cell::RefCell};
use std::panic;
use std::sync::{Arc, Mutex};
use wasm_bindgen::prelude::*;
use web_sys::{
    WebGlTexture,
    HtmlElement,
    MouseEvent,
    Event,
    ErrorEvent,
    KeyboardEvent,
    MessageEvent,
    WebGl2RenderingContext,
    WebSocket,
    Response,
    HtmlButtonElement,
};
use serde::{Serialize, Deserialize};

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

static mut WEBSOCKET: Option<WebSocket> = None;

#[wasm_bindgen]
pub fn stop() {
	unsafe {
		if let Some(ws) = &WEBSOCKET {
			ws.close().unwrap();
			WEBSOCKET = None;
		}
	}
}

#[wasm_bindgen]
pub async fn start() -> Result<(), JsValue> {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    //
    //CONST department
    let window = web_sys::window().expect("No window element");
    let document = window.document().expect("No document element");
    
    let play_button: HtmlButtonElement = document.get_element_by_id("play-button").expect("No element solo").dyn_into::<HtmlButtonElement>()?;
    let pop_up_play: HtmlElement = document.get_element_by_id("popUpPlay").expect("No element popup").dyn_into::<HtmlElement>()?; 
    let pop_up_score: HtmlElement = document.get_element_by_id("popUpScore").expect("No element popup").dyn_into::<HtmlElement>()?; 
    let context = render::get_context(&document)?;
	let _ = context.clear_color(0.0, 0.0, 0.0, 1.0);
    let _ = context.clear(WebGl2RenderingContext::COLOR_BUFFER_BIT);
    let me: Response = wasm_bindgen_futures::JsFuture::from(window.fetch_with_str("/api/me"))
        .await?
        .dyn_into::<Response>()?; 
    let me = wasm_bindgen_futures::JsFuture::from(me.json()?).await?;
    let me: Me = serde_wasm_bindgen::from_value(me)?;
    console_log!("{:?}", me.selectedSkinUrl);
    let (_image, texture) = load_texture(&context, "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/1920px-Flag_of_France.svg.png")?;
    let vertex_shader = render::compile_shader(
        &context,
        WebGl2RenderingContext::VERTEX_SHADER,
        r##"#version 300 es
 
		precision highp float;
        
		in vec4			position;

        void main() {
            gl_Position = position;
        }
        "##,
    )?;
    let fragment_shader = render::compile_shader(
        &context,
        WebGl2RenderingContext::FRAGMENT_SHADER,
        r##"#version 300 es
    
		precision highp float;
		
        out vec4		outColor;
        
        void main() {
        	outColor = vec4(1, 1, 1, 1);
		}
        "##,
    )?;
    let circle_vertex_shader = render::compile_shader(
        &context,
        WebGl2RenderingContext::VERTEX_SHADER,
        r##"#version 300 es
 
		precision highp float;
        
		in vec4     position;
        out vec2    v_texcoord;

        void main() {

            gl_Position = position;
            if (gl_VertexID % 2 == 0)
                v_texcoord = vec2(0.5, 0.5);
            else
            {
                float j = float((gl_VertexID - 1) / 2) * 2.0 * 3.14159 / 32.0;
                v_texcoord = vec2((cos(j) + 1.0) / 2.0 , (sin(j) + 1.0) / 2.0);
            }
        }
        "##,
    )?;
    let circle_fragment_shader = render::compile_shader(
        &context,
        WebGl2RenderingContext::FRAGMENT_SHADER,
        r##"#version 300 es
    
		precision highp float;
		in vec2             v_texcoord;
        uniform sampler2D   u_texture;
        out vec4		    outColor;
        
        void main() {
        	outColor = texture(u_texture, v_texcoord);
		}
        "##,
    )?;
   
    let winner = document.get_element_by_id("winner").expect("no element winner");
    let which_side: HtmlElement = document.get_element_by_id("popup-start-play").expect("no element popup-start-play").dyn_into::<HtmlElement>()?;
    let final_score = document.get_element_by_id("final-score").expect("no element final score");
    let current_score = document.get_element_by_id("current-score").expect("no element current score").dyn_into::<HtmlElement>()?;
    let replay: HtmlButtonElement = document.get_element_by_id("replay-button").expect("no element replay-button").dyn_into::<HtmlButtonElement>()?;
    let client_data = game::OnConnectClient::new(&document, me.name);
    let game_id = Arc::new(Mutex::new(String::new()));
 
    // WebSocket department
    
    let location = document.location().expect("No location found").host()?;
    let index = location.rfind(":").expect("error parsing location");
    let path = "ws://".to_owned() + &location[0..index]+ ":4210/";
    let web_socket = WebSocket::new(&path)?;
    web_socket.set_binary_type(web_sys::BinaryType::Arraybuffer);
    
    // Callbacks
   
    let cloned_pus = pop_up_score.clone();
    let cloned_pup = pop_up_play.clone();
    let onclick_replay_callback = Closure::<dyn FnMut(_)>::new(move |_event: MouseEvent| {
        cloned_pus.style().set_property("display", "none").unwrap();
        cloned_pup.style().set_property("display", "flex").unwrap();
    });


    let cloned_game_id = Arc::clone(&game_id);
    let cloned_pu = pop_up_score.clone();
    let cloned_winner = winner.clone();
    let cloned_fs = final_score.clone();
    let cloned_cs = current_score.clone();
    let cloned_cd = client_data.clone();
    let onmessage_callback = Closure::<dyn FnMut(_)>::new(move |event: MessageEvent| {
        if let Ok(txt) = event.data().dyn_into::<js_sys::JsString>() {
            match &txt.as_string().unwrap()[0..6] {
                "GAMEID" => {
                    *cloned_game_id.lock().unwrap() = txt.as_string().unwrap()[6..].to_string();
					console_log!("Game Id received");
                },
                "PLYONE" => {
                    let side = if &txt.as_string().unwrap()[6..] == &cloned_cd.id {"Left"} else {"Right"};
                    which_side.set_inner_text(format!("{} Side", side).as_str());
                    which_side.style().set_property("display", "flex");
					console_log!("Player 1 received: {} vs {} = {}",&txt.as_string().unwrap()[6..], &cloned_cd.id,&txt.as_string().unwrap()[6..] == &cloned_cd.id);
                },
                "UPDATE" => {
                    let game_state: render::GameState = serde_json::from_str(&txt.as_string().unwrap()[6..]).unwrap();
                    let (p1, p2) = game_state.score;
                    let score_str = p1.to_string() + " - " + &p2.to_string();
                    which_side.style().set_property("display", "none");
					if game_state.finished {
						match game_state.winner {
							render::EndGame::Player1 => cloned_winner.set_inner_html("Player 1 won"),
							render::EndGame::Player2 => cloned_winner.set_inner_html("Player 2 won"),
							render::EndGame::Draw => cloned_winner.set_inner_html("Draw"),
							render::EndGame::Undecided => cloned_winner.set_inner_html("Undecided"),
						}
                        cloned_pu.style().set_property("display", "flex").unwrap();
                    	cloned_fs.set_inner_html(score_str.as_str());
                        cloned_cs.style().set_property("display", "none").unwrap();
						let _ = &context.clear_color(0.0, 0.0, 0.0, 1.0);
    					let _ = &context.clear(WebGl2RenderingContext::COLOR_BUFFER_BIT);
					} else {
                        cloned_cs.style().set_property("display", "flex").unwrap();
                    	cloned_cs.set_inner_html(score_str.as_str());
	                	render::render(game_state, &context, &vertex_shader, &fragment_shader, &circle_vertex_shader, &circle_fragment_shader, &texture).expect("Rendering failed");
					}
                },
                _ => console_log!("{txt}"),
            }
        }
    });

    let onerror_callback = Closure::<dyn FnMut(_)>::new(move |event: ErrorEvent| {
        console_log!("error callback: {:?}", event);
    });

    let cloned_ws = web_socket.clone();
    let cloned_data = client_data.clone();
    let onopen_callback = Closure::<dyn FnMut(_)>::new(move |_event: Event| {
        match cloned_ws.send_with_str(("NEW  ".to_owned() + &serde_json::to_string(&cloned_data).unwrap()).as_str()) {
            Ok(_) => console_log!("messages sent"),
            Err(err) => console_log!("error sending message: {:?}", err),
        }
        //can do a similar match with cloned_ws.send_with_u8_array to send binary message
    });
  
    let cloned_data = client_data.clone();
    let cloned_ws = web_socket.clone();
    let cloned_pb = play_button.clone();
    let cloned_pu = pop_up_play.clone();
    let onclick_play = Closure::<dyn FnMut(_)>::new(move |_event: MouseEvent| {
        cloned_pu.style().set_property("display", "none").unwrap();
        if &cloned_pb.name() == "player" {
            match cloned_ws.send_with_str(("MULTI".to_owned() + &serde_json::to_string(&cloned_data).unwrap()).as_str()) {
                Ok(_) => console_log!("messages sent"),
                Err(err) => console_log!("error sending message: {:?}", err),
            }
        } else {
            match cloned_ws.send_with_str(("SOLO ".to_owned() + &serde_json::to_string(&cloned_data).unwrap()).as_str()) {
                Ok(_) => console_log!("messages sent"),
                Err(err) => console_log!("error sending message: {:?}", err),
            }
        }
    });

    let cloned_ws = web_socket.clone();
    let cloned_data = client_data.clone();
    let cloned_game_id = Arc::clone(&game_id);
    let onkey_down_callback = Closure::<dyn FnMut(_)>::new(move |event: KeyboardEvent| {
        match event.code().as_str() {
            "KeyW" | "ArrowUp" => {
                let game_id = cloned_game_id.lock().unwrap().clone();
                let movement = game::Move {
                    id: cloned_data.id.clone(),
                    game_id,
                    movement: "UP".to_string()
                };
                match cloned_ws.send_with_str(("MOVE ".to_owned() + &serde_json::to_string(&movement).unwrap()).as_str()) {
                    Ok(_) => console_log!("up sent"),
                    Err(err) => console_log!("up failed: {:?}", err)
                }
            },
            "KeyS" | "ArrowDown" => {
                let game_id = cloned_game_id.lock().unwrap().clone();
                let movement = game::Move {
                    id: cloned_data.id.clone(),
                    game_id,
                    movement: "DOWN".to_string()
                };
                match cloned_ws.send_with_str(("MOVE ".to_owned() + &serde_json::to_string(&movement).unwrap()).as_str()) {
                    Ok(_) => console_log!("down sent"),
                    Err(err) => console_log!("down failed: {:?}", err)
                }
            },
            _ => (),
        }
    });
    
    let cloned_ws = web_socket.clone();
    let cloned_data = client_data.clone();
    let cloned_game_id = Arc::clone(&game_id);
    let onkey_up_callback = Closure::<dyn FnMut(_)>::new(move |event: KeyboardEvent| {
        match event.code().as_str() {
            "KeyW" | "ArrowUp" => {
                let game_id = cloned_game_id.lock().unwrap().clone();
                let movement = game::Move {
                    id: cloned_data.id.clone(),
                    game_id,
                    movement: "UP".to_string()
                };
                match cloned_ws.send_with_str(("SMOVE".to_owned() + &serde_json::to_string(&movement).unwrap()).as_str()) {
                    Ok(_) => console_log!("up sent"),
                    Err(err) => console_log!("up failed: {:?}", err)
                }
            },
            "KeyS" | "ArrowDown" => {
                let game_id = cloned_game_id.lock().unwrap().clone();
                let movement = game::Move {
                    id: cloned_data.id.clone(),
                    game_id,
                    movement: "DOWN".to_string()
                };
                match cloned_ws.send_with_str(("SMOVE".to_owned() + &serde_json::to_string(&movement).unwrap()).as_str()) {
                    Ok(_) => console_log!("down sent"),
                    Err(err) => console_log!("down failed: {:?}", err)
                }
            },
            _ => (),
        }
    });
    // Setting callbacks
    
    replay.set_onclick(Some(onclick_replay_callback.as_ref().unchecked_ref()));
    play_button.set_onclick(Some(onclick_play.as_ref().unchecked_ref()));
    document.add_event_listener_with_callback("keydown", onkey_down_callback.as_ref().unchecked_ref())?;
    document.add_event_listener_with_callback("keyup", onkey_up_callback.as_ref().unchecked_ref())?;
    web_socket.set_onmessage(Some(onmessage_callback.as_ref().unchecked_ref()));
    web_socket.set_onerror(Some(onerror_callback.as_ref().unchecked_ref()));
    web_socket.set_onopen(Some(onopen_callback.as_ref().unchecked_ref()));

    onclick_replay_callback.forget();
    onopen_callback.forget();
    onmessage_callback.forget();
    onerror_callback.forget();
    onkey_down_callback.forget();
    onkey_up_callback.forget();
    onclick_play.forget();

	unsafe {
		WEBSOCKET = Some(web_socket);
	}

	Ok(())
}

fn load_texture(context: &WebGl2RenderingContext, url: &str) -> Result<(Rc<RefCell<web_sys::HtmlImageElement>>, Rc<WebGlTexture>), JsValue> {
    let texture = context.create_texture().ok_or("Failed to create texture")?;
    context.bind_texture(WebGl2RenderingContext::TEXTURE_2D, Some(&texture));

    // Initialize the texture with a 1x1 blue pixel
    let blue_pixel = [0, 0, 255, 255];
    context.tex_image_2d_with_i32_and_i32_and_i32_and_format_and_type_and_opt_u8_array(
        WebGl2RenderingContext::TEXTURE_2D,
        0,
        WebGl2RenderingContext::RGBA as i32,
        1,
        1,
        0,
        WebGl2RenderingContext::RGBA,
        WebGl2RenderingContext::UNSIGNED_BYTE,
        Some(&blue_pixel),
    )?;

    // Shared ownership of the texture and context
    let texture = Rc::new(texture);
    let context = Rc::new(context.clone());

    // Load the image
    let image = Rc::new(RefCell::new(web_sys::HtmlImageElement::new()?));
    let texture_clone = Rc::clone(&texture);
    let context_clone = Rc::clone(&context);
    let image_clone: Rc<RefCell<web_sys::HtmlImageElement>> = Rc::clone(&image);
    let closure = Closure::wrap(Box::new(move || {
        context_clone.bind_texture(WebGl2RenderingContext::TEXTURE_2D, Some(&texture_clone));
        context_clone.tex_image_2d_with_u32_and_u32_and_html_image_element(
            WebGl2RenderingContext::TEXTURE_2D,
            0,
            WebGl2RenderingContext::RGBA as i32,
            WebGl2RenderingContext::RGBA,
            WebGl2RenderingContext::UNSIGNED_BYTE,
            &image_clone.borrow(),
        );

        context_clone.generate_mipmap(WebGl2RenderingContext::TEXTURE_2D);
    }) as Box<dyn Fn()>);
    
    image.borrow().set_onload(Some(closure.as_ref().unchecked_ref()));
    closure.forget();
    image.borrow().set_cross_origin(Some(""));
    image.borrow().set_src(url);

    Ok((image, texture))
}

#[derive(Serialize, Deserialize)]
struct Me {
    pub name: String,
    email: String,
    level: u32,
    levelPercentage: f32,
    avatar: String,
    friendsRequests: Vec<FriendRequests>,
    friends: Vec<Friend>,
    gameHistory: Vec<GameHistory>,
    skins: Vec<String>,
    selectedSkin: String,
    pub selectedSkinUrl: String,
}

#[derive(Serialize, Deserialize)]
struct Friend {
    name: String,
    avatar: String,
    level: u32,
    last_online: String,
}

#[derive(Serialize, Deserialize)]
struct FriendRequests {
    name: String,
    avatar: String,
    level: u32,
}

#[derive(Serialize, Deserialize)]
struct GameHistory {
    game: String,
    score: Vec<u32>,
    win: bool,
    xp: u32,
}
