use wasm_bindgen::prelude::*;
use web_sys::{
    WebGl2RenderingContext,
    WebGlProgram,
    WebGlShader,
    WebGlTexture,
    HtmlCanvasElement,
    Document,
};
use serde::{
    Serialize,
    Deserialize,
};
use glam::Vec2;

const WINDOWS_WIDTH         : f32 = 1920.;
const WINDOWS_HEIGHT        : f32 = 1440.;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Entity {
    pub width       : f32,
    pub height      : f32,
    pub position    : Vec2,
    pub velocity    : Vec2,
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
  pub player1_ent   : Entity,
  pub player2_ent   : Entity,
  pub ball_ent      : Entity,
  pub score         : (i16, i16),
  pub winner        : EndGame,
  pub finished      : bool,
}

pub struct Circle {
    pub center      : Vec2,
    pub rayon       : Vec2
}

pub fn normalize_coord(c: Vec2) -> Vec2 {
    c / Vec2::new(WINDOWS_WIDTH, WINDOWS_HEIGHT)
}

pub fn view_coord(c: Vec2) -> Vec2 {
    normalize_coord(c) * 2. - 1.
}

pub fn render(
    game_state: GameState,
    context: &WebGl2RenderingContext,
    vertex_shader: &WebGlShader,
    fragment_shader: &WebGlShader,
    circle_vertex_shader: &WebGlShader,
    circle_fragment_shader: &WebGlShader,
    texture: &WebGlTexture,
) -> Result<(), JsValue> {

    let program = link_program(context, vertex_shader, fragment_shader)?;
    context.use_program(Some(&program));

    let c1 = view_coord(game_state.player1_ent.position);
    let c2 = view_coord(game_state.player1_ent.position + Vec2::new(game_state.player1_ent.width, game_state.player1_ent.height));
    let player1_vertices: [f32; 12] = [
		c1.x, c1.y, 0.0,
		c2.x, c1.y, 0.0,
		c1.x, c2.y, 0.0,
		c2.x, c2.y, 0.0
	];

    let c1 = view_coord(game_state.player2_ent.position);
    let c2 = view_coord(game_state.player2_ent.position + Vec2::new(game_state.player2_ent.width, game_state.player2_ent.height));
    let player2_vertices: [f32; 12] = [
		c1.x, c1.y, 0.0,
		c2.x, c1.y, 0.0,
		c1.x, c2.y, 0.0,
		c2.x, c2.y, 0.0
	];

	let vector_vertices = vec![player1_vertices, player2_vertices];

    let rayon = Vec2::new(game_state.ball_ent.width, game_state.ball_ent.height) / 2.;
    let circle = Circle {
        center  : view_coord(game_state.ball_ent.position + rayon),
        rayon   : view_coord(game_state.ball_ent.position + rayon) - view_coord(game_state.ball_ent.position)

    };

	context.clear_color(0.0, 0.0, 0.0, 1.0);
    context.clear(WebGl2RenderingContext::COLOR_BUFFER_BIT);
	display_rectangles(context, vector_vertices, &program)?;
    let program = link_program(context, circle_vertex_shader, circle_fragment_shader)?;
    context.use_program(Some(&program));
	display_circles(context, vec![circle], &program, &texture)?;

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

fn display_circles<'a>(context: &'a WebGl2RenderingContext, circles: Vec<Circle>, program: &WebGlProgram, texture: &WebGlTexture) -> Result<(), JsValue> {
	for circle in circles {
	
    	let position_attribute_location = context.get_attrib_location(program, "position");
    	let buffer = context.create_buffer().ok_or("Failed to create buffer")?;
    	context.bind_buffer(WebGl2RenderingContext::ARRAY_BUFFER, Some(&buffer));
		let vert_count = 2;
		let mut circle_vertices = vec![];
		circle_vertices.extend_from_slice(&vec![circle.center.x, circle.center.y]);

		for i in 0..=32 {
			let j: f32 = i as f32 * 2. * std::f32::consts::PI / 32.;
			let vert1 = [circle.center.x + circle.rayon.x * j.cos(), circle.center.y + circle.rayon.y * j.sin()];
			let vert2 = [circle.center.x, circle.center.y];
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

        context.active_texture(WebGl2RenderingContext::TEXTURE0);
        context.bind_texture(WebGl2RenderingContext::TEXTURE_2D, Some(texture));
        context.uniform1i(context.get_uniform_location(&program, "u_texture").as_ref(), 0);

        context.draw_arrays(WebGl2RenderingContext::TRIANGLE_STRIP, 0, (circle_vertices.len() / vert_count) as i32);
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

        context.draw_arrays(WebGl2RenderingContext::TRIANGLE_STRIP, 0, 4);
	}
	Ok(())
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
