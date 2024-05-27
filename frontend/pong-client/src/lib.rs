mod render;
mod game;

use std::panic;
use std::sync::{Arc, Mutex};
use wasm_bindgen::prelude::*;
use web_sys::{
    HtmlElement, MouseEvent, Event, ErrorEvent, KeyboardEvent, MessageEvent, WebGl2RenderingContext, WebSocket, HtmlButtonElement
};

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn start() -> Result<(), JsValue> {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    //
    //CONST department
   
    let document = web_sys::window().expect("No window element")
        .document().expect("No document element");
    
    let play_button: HtmlButtonElement = document.get_element_by_id("play-button").expect("No element solo").dyn_into::<HtmlButtonElement>()?;
    let pop_up_play: HtmlElement = document.get_element_by_id("popUpPlay").expect("No element popup").dyn_into::<HtmlElement>()?; 
    let pop_up_score: HtmlElement = document.get_element_by_id("popUpScore").expect("No element popup").dyn_into::<HtmlElement>()?; 
    let context = render::get_context(&document)?;
	let _ = context.clear_color(0.0, 0.0, 0.0, 1.0);
    let _ = context.clear(WebGl2RenderingContext::COLOR_BUFFER_BIT);
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
   
    let winner = document.get_element_by_id("winner").expect("no element winner");
    let final_score = document.get_element_by_id("final-score").expect("no element final score");
    let replay: HtmlButtonElement = document.get_element_by_id("replay-button").expect("no element replay-button").dyn_into::<HtmlButtonElement>()?;
    let client_data = game::OnConnectClient::new(&document, uuid::Uuid::new_v4().to_string());
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
        cloned_pus.style().set_property("display", "none");
        cloned_pup.style().set_property("display", "flex");
    });


    let cloned_game_id = Arc::clone(&game_id);
    let cloned_pu = pop_up_score.clone();
    let cloned_winner = winner.clone();
    let cloned_fs = final_score.clone();
    let onmessage_callback = Closure::<dyn FnMut(_)>::new(move |event: MessageEvent| {
        if let Ok(txt) = event.data().dyn_into::<js_sys::JsString>() {
            match &txt.as_string().unwrap()[0..6] {
                "GAMEID" => {
                    *cloned_game_id.lock().unwrap() = txt.as_string().unwrap()[6..].to_string();
					console_log!("Game Id received");
                },
                "UPDATE" => {
					console_log!("Update received");
                    let game_state: render::GameState = serde_json::from_str(&txt.as_string().unwrap()[6..]).unwrap();
                    let (p1, p2) = game_state.score;
                    let score_str = p1.to_string() + " - " + &p2.to_string();
					if game_state.finished {
						match game_state.winner {
							render::EndGame::Player1 => cloned_winner.set_inner_html("Player 1 won"),
							render::EndGame::Player2 => cloned_winner.set_inner_html("Player 2 won"),
							render::EndGame::Draw => cloned_winner.set_inner_html("Draw"),
							render::EndGame::Undecided => cloned_winner.set_inner_html("Undecided"),
						}
                        cloned_pu.style().set_property("display", "flex");
                    	cloned_fs.set_inner_html(score_str.as_str());
						let _ = &context.clear_color(0.0, 0.0, 0.0, 1.0);
    					let _ = &context.clear(WebGl2RenderingContext::COLOR_BUFFER_BIT);
					} else {
	                	render::render(game_state, &context, &vertex_shader, &fragment_shader).expect("Rendering failed");
					}
                },
                _ => (),
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
        cloned_pu.style().set_property("display", "none");
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
                match cloned_ws.send_with_str(("MOVE".to_owned() + &serde_json::to_string(&movement).unwrap()).as_str()) {
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
                match cloned_ws.send_with_str(("MOVE".to_owned() + &serde_json::to_string(&movement).unwrap()).as_str()) {
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
	Ok(())
}
