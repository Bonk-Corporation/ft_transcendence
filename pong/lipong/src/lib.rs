mod render;
mod game;

use std::sync::{Arc, Mutex};
use wasm_bindgen::prelude::*;
use web_sys::{
    MouseEvent, Event, ErrorEvent, KeyboardEvent, MessageEvent, WebGl2RenderingContext, WebSocket, HtmlButtonElement
};

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen(start)]
fn start() -> Result<(), JsValue> {
    //CONST department
   
    let document = web_sys::window().expect("No window element")
        .document().expect("No document element");
    
    let multi_button: HtmlButtonElement = document.get_element_by_id("multi").expect("No element multi").dyn_into::<HtmlButtonElement>()?;
    let solo_button: HtmlButtonElement = document.get_element_by_id("solo").expect("No element solo").dyn_into::<HtmlButtonElement>()?;
    
    let context = render::get_context(&document)?;
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
   
    let score = document.get_element_by_id("score").expect("no element score");
    let client_data = game::OnConnectClient::new(&document, uuid::Uuid::new_v4().to_string());
    let game_id = Arc::new(Mutex::new(String::new()));
 
    // WebSocket department
    
    let location = document.location().expect("No location found").host()?;
    let index = location.rfind(":").expect("error parsing location");
    let path = "ws://".to_owned() + &location[0..index]+ ":6969/";
    let web_socket = WebSocket::new(&path)?;
    web_socket.set_binary_type(web_sys::BinaryType::Arraybuffer);
    
    // Callbacks
    
    let cloned_game_id = Arc::clone(&game_id);
    let cloned_score = score.clone();
    let onmessage_callback = Closure::<dyn FnMut(_)>::new(move |event: MessageEvent| {
        if let Ok(txt) = event.data().dyn_into::<js_sys::JsString>() {
            match &txt.as_string().unwrap()[0..6] {
                "GAMEID" => {
                    *cloned_game_id.lock().unwrap() = txt.as_string().unwrap()[6..].to_string();
                },
                "UPDATE" => {
                    let game_state: render::GameState = serde_json::from_str(&txt.as_string().unwrap()[6..]).unwrap();
                    let (p1, p2) = game_state.score;
                    let score_str = "Player 1: ".to_owned() + &p1.to_string() + " Player 2: " + &p2.to_string();
                    cloned_score.set_inner_html(score_str.as_str());
	                render::render(game_state, &context, &vertex_shader, &fragment_shader).expect("Rendering failed");
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
    let onclick_multi = Closure::<dyn FnMut(_)>::new(move |_event: MouseEvent| {
        match cloned_ws.send_with_str(("MULTI".to_owned() + &serde_json::to_string(&cloned_data).unwrap()).as_str()) {
            Ok(_) => console_log!("messages sent"),
            Err(err) => console_log!("error sending message: {:?}", err),
        }
    });

    let cloned_data = client_data.clone();
    let cloned_ws = web_socket.clone();
    let onclick_solo = Closure::<dyn FnMut(_)>::new(move |_event: MouseEvent| {
        match cloned_ws.send_with_str(("SOLO ".to_owned() + &serde_json::to_string(&cloned_data).unwrap()).as_str()) {
            Ok(_) => console_log!("messages sent"),
            Err(err) => console_log!("error sending message: {:?}", err),
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
    // Setting web_socket with callbacks
    
    multi_button.set_onclick(Some(onclick_multi.as_ref().unchecked_ref()));
    solo_button.set_onclick(Some(onclick_solo.as_ref().unchecked_ref()));
    document.add_event_listener_with_callback("keydown", onkey_down_callback.as_ref().unchecked_ref())?;
    document.add_event_listener_with_callback("keyup", onkey_up_callback.as_ref().unchecked_ref())?;
    web_socket.set_onmessage(Some(onmessage_callback.as_ref().unchecked_ref()));
    web_socket.set_onerror(Some(onerror_callback.as_ref().unchecked_ref()));
    web_socket.set_onopen(Some(onopen_callback.as_ref().unchecked_ref()));

    onopen_callback.forget();
    onmessage_callback.forget();
    onerror_callback.forget();
    onkey_down_callback.forget();
    onkey_up_callback.forget();
    onclick_multi.forget();
    onclick_solo.forget();
	Ok(())
}
