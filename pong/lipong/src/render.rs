use wasm_bindgen::prelude::*;
use web_sys::{
    WebGl2RenderingContext,
    WebGlProgram,
    WebGlShader,
    HtmlCanvasElement,
    Document,
};
use serde::{
    Serialize,
    Deserialize,
};

const SCREEN_CENTER_X: f32 = 320.; 
const SCREEN_CENTER_Y: f32 = 240.;
const SCREEN_WIDTH: f32 = 640.;
const SCREEN_HEIGHT: f32 = 480. / 2.;

#[derive(Clone, Serialize, Deserialize)]
pub struct Entity {
   pub width: f32,
   pub height: f32,
   pub position:(f32, f32),
   pub velocity:(f32, f32),
}

#[derive(Clone, Serialize, Deserialize)]
pub enum EndGame {
	Player1,
	Player2,
	Draw,
	Undecided,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct GameState {
  pub player1_ent  : Entity,
  pub player2_ent  : Entity,
  pub ball_ent     : Entity,
  pub score    : (i16, i16),
  pub winner: EndGame,
  pub finished: bool,
}

pub fn render(
    game_state: GameState,
    context: &WebGl2RenderingContext,
    vertex_shader: &WebGlShader,
    fragment_shader: &WebGlShader
) -> Result<(), JsValue> {

    let program = link_program(context, vertex_shader, fragment_shader)?;
    context.use_program(Some(&program));
    let (x1, y1) = game_state.player1_ent.position;
    let x1 = (x1 - SCREEN_CENTER_X) / SCREEN_CENTER_X + 0.05;
    let y1 = (y1 - SCREEN_CENTER_Y) / SCREEN_CENTER_Y;
    let width = game_state.player1_ent.width / SCREEN_WIDTH;
    let height = game_state.player1_ent.height / SCREEN_HEIGHT;
    let player1_vertices: [f32; 12] = [
		x1, y1, 0.0,
		x1 + width, y1, 0.0,
		x1, y1 + height, 0.0,
		x1 + width, y1 + height, 0.0
	];
    let (x2, y2) = game_state.player2_ent.position; 
    let x2 = (x2 - SCREEN_CENTER_X) / SCREEN_CENTER_X + 0.05;
    let y2 = (y2 - SCREEN_CENTER_Y) / SCREEN_CENTER_Y;
    let player2_vertices: [f32; 12] = [
		x2, y2, 0.0,
		x2 + width, y2, 0.0,
		x2, y2 + height, 0.0,
		x2 + width, y2 + height, 0.0
	];
    

	let vector_vertices = vec![player1_vertices, player2_vertices];

	context.clear_color(0.0, 0.0, 0.0, 1.0);
    context.clear(WebGl2RenderingContext::COLOR_BUFFER_BIT);

    let (x3, y3) = game_state.ball_ent.position; 
    let x3 = (x3 - SCREEN_CENTER_X) / SCREEN_CENTER_X;
    let y3 = (y3 - SCREEN_CENTER_Y) / SCREEN_CENTER_Y;
	display_rectangles(context, vector_vertices, &program)?;
	display_circles(context, vec![[x3, y3]] , &program)?;

    Ok(())

}

pub fn get_context(document: &Document) -> Result<WebGl2RenderingContext, JsValue> {
    let canvas = document.get_element_by_id("canvas").expect("No canvas element");
    let canvas: HtmlCanvasElement = canvas.dyn_into::<HtmlCanvasElement>()?;

    let context = canvas
        .get_context("webgl2")?
        .unwrap()
        .dyn_into::<WebGl2RenderingContext>()?;
	Ok(context)
}

fn display_circles(context: &WebGl2RenderingContext, centers: Vec<[f32; 2]>, program: &WebGlProgram) -> Result<(), JsValue> {
	for center in centers {
	
    	let position_attribute_location = context.get_attrib_location(program, "position");
    	let buffer = context.create_buffer().ok_or("Failed to create buffer")?;
    	context.bind_buffer(WebGl2RenderingContext::ARRAY_BUFFER, Some(&buffer));
		let vert_count = 2;
		let mut circle_vertices = vec![];
		circle_vertices.extend_from_slice(&center);
		let r_h = 0.04;
		let r_w = 0.05;

		for i in 0..=2000 {
			let j: f32 = i as f32 * 2. * std::f32::consts::PI / 2000.;
			let vert1 = [center[0] + r_h * j.sin(), center[1] + r_w * j.cos()];
			let vert2 = [center[0], center[1]];
			circle_vertices.extend_from_slice(&vert1);
			circle_vertices.extend_from_slice(&vert2);
		}

    	unsafe {
        	let position_array_buf_view_1 = js_sys::Float32Array::view(circle_vertices.as_slice());

        	context.buffer_data_with_array_buffer_view(
            	WebGl2RenderingContext::ARRAY_BUFFER,
            	&position_array_buf_view_1,
            	WebGl2RenderingContext::STATIC_DRAW,
        	);
    	}

    	let vertex_array_object = context
        	.create_vertex_array()
        	.ok_or("Could not create vertex array object")?;
    	context.bind_vertex_array(Some(&vertex_array_object));

    	context.vertex_attrib_pointer_with_i32(
        	position_attribute_location as u32,
        	2,
        	WebGl2RenderingContext::FLOAT,
        	false,
        	0,
        	0,
    	);
    	context.enable_vertex_attrib_array(position_attribute_location as u32);
    	context.bind_vertex_array(Some(&vertex_array_object));

    	draw(context, (circle_vertices.len() / vert_count) as i32);
	}
	Ok(())
	
}

fn display_rectangles(context: &WebGl2RenderingContext, vector_vertices: Vec<[f32; 12]>, program: &WebGlProgram) -> Result<(), JsValue> {
	for vertices in vector_vertices {

    	let position_attribute_location = context.get_attrib_location(program, "position");
    	let buffer = context.create_buffer().ok_or("Failed to create buffer")?;
    	context.bind_buffer(WebGl2RenderingContext::ARRAY_BUFFER, Some(&buffer));

    	unsafe {
        	let position_array_buf_view_1 = js_sys::Float32Array::view(&vertices);

        	context.buffer_data_with_array_buffer_view(
            	WebGl2RenderingContext::ARRAY_BUFFER,
            	&position_array_buf_view_1,
            	WebGl2RenderingContext::STATIC_DRAW,
        	);
    	}

    	let vertex_array_object = context
        	.create_vertex_array()
        	.ok_or("Could not create vertex array object")?;
    	context.bind_vertex_array(Some(&vertex_array_object));

    	context.vertex_attrib_pointer_with_i32(
        	position_attribute_location as u32,
        	3,
        	WebGl2RenderingContext::FLOAT,
        	false,
        	0,
        	0,
    	);
    	context.enable_vertex_attrib_array(position_attribute_location as u32);
    	context.bind_vertex_array(Some(&vertex_array_object));

    	draw(context, 4);
	}
	Ok(())
}

fn draw(context: &WebGl2RenderingContext, vertex_count: i32) {
    context.draw_arrays(WebGl2RenderingContext::TRIANGLE_STRIP, 0, vertex_count);
}

pub fn compile_shader(
    context: &WebGl2RenderingContext,
    shader_type: u32,
    source: &str,
) -> Result<WebGlShader, String> {
    let shader = context
        .create_shader(shader_type)
        .ok_or_else(|| String::from("Unable to create shader object"))?;
    context.shader_source(&shader, source);
    context.compile_shader(&shader);

    if context
        .get_shader_parameter(&shader, WebGl2RenderingContext::COMPILE_STATUS)
        .as_bool()
        .unwrap_or(false)
    {
        Ok(shader)
    } else {
        Err(context
            .get_shader_info_log(&shader)
            .unwrap_or_else(|| String::from("Unknown error creating shader")))
    }
}

pub fn link_program(
    context: &WebGl2RenderingContext,
    vert_shader: &WebGlShader,
    frag_shader: &WebGlShader,
) -> Result<WebGlProgram, String> {
    let program = context
        .create_program()
        .ok_or_else(|| String::from("Unable to create shader object"))?;

    context.attach_shader(&program, vert_shader);
    context.attach_shader(&program, frag_shader);
    context.link_program(&program);

    if context
        .get_program_parameter(&program, WebGl2RenderingContext::LINK_STATUS)
        .as_bool()
        .unwrap_or(false)
    {
        Ok(program)
    } else {
        Err(context
            .get_program_info_log(&program)
            .unwrap_or_else(|| String::from("Unknown error creating program object")))
    }
}
