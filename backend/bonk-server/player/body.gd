extends RigidBody2D

@export var username: String
@export var skin: String
@export var score: int = 0
@export var death_state: bool = false
@export var power: float = 100
@export var tired_state: bool = false
@export var grapple_state: bool = false
@export var heavy_state: bool = false

class ClientInput:
	var up_pressed : bool = false
	var down_pressed : bool = false
	var left_pressed : bool = false
	var right_pressed : bool = false
	var grapple_pressed : bool = false
	var heavy_pressed : bool = false

var client_input = ClientInput.new()
var grapple_anchor = Vector2.ZERO
var grapple_radius = 0
var too_far = false

func circular_coordinates(angle):
	var angle_radians = deg_to_rad(angle)
	var x = Settings.max_grapple_radius * cos(angle_radians)
	var y = Settings.max_grapple_radius * sin(angle_radians)
	return Vector2(x, y)

func nearest_collision():
	var nearest_collision_distance = Settings.max_grapple_radius + 1
	var nearest_collision_point = Vector2.ZERO
	for angle in range(361):
		var raycast = get_node("raycast_" + str(angle))
		if raycast.is_colliding():
			var collision_point = raycast.get_collision_point()
			var collision_distance = global_position.distance_to(collision_point)
			if collision_distance < nearest_collision_distance:
				nearest_collision_distance = collision_distance
				nearest_collision_point = collision_point
	return nearest_collision_point

@rpc("any_peer")
func receive_client_input(serialized_input):
	client_input = dict_to_inst(serialized_input)

func _ready():
	collision_layer = 1 << get_parent().get_parent().get_parent().layer
	collision_mask = 1 << get_parent().get_parent().get_parent().layer
	var physic = PhysicsMaterial.new()
	physic.set_bounce(Settings.bounce)
	set_physics_material_override(physic)
	get_node("username").set_text(username)
	if multiplayer.is_server():
		for angle in range(361):
			var raycast = RayCast2D.new()
			raycast.collide_with_areas = true
			raycast.collide_with_bodies = false
			raycast.target_position = circular_coordinates(angle)
			raycast.name = "raycast_" + str(angle)
			add_child(raycast)
			raycast.position = Vector2.ZERO
	else:
		get_node("../skin").request(Settings.api_path + skin)
		lock_rotation = true

func _integrate_forces(state):
	if multiplayer.is_server():
		if position.y > 1000:
			linear_velocity = Vector2.ZERO
			death_state = true
		if client_input.up_pressed:
			var contact_count = state.get_contact_count()
			if contact_count > 0:
				var normal = state.get_contact_local_normal(0)
				var contact_angle = rad_to_deg(atan2(normal.y, normal.x))
				if contact_angle < -45 && contact_angle > -135:
					jump(state)
			up(state)
		if client_input.down_pressed:
			down(state)
		if client_input.left_pressed:
			left(state)
		if client_input.right_pressed:
			right(state)
		if client_input.grapple_pressed:
			grapple()
		else:
			grapple_stop()
		if client_input.heavy_pressed:
			heavy_start()
		else:
			heavy_stop()

func tired():
	power = 0
	tired_state = true
	grapple_stop()
	await get_tree().create_timer(Settings.tired_time).timeout
	tired_state = false

func _process(delta):
	if str(multiplayer.get_unique_id()) == get_parent().get_name():
		if Input.is_action_just_pressed("up"):
			client_input.up_pressed = true
		if Input.is_action_just_pressed("down"):
			client_input.down_pressed = true
		if Input.is_action_just_pressed("left"):
			client_input.left_pressed = true
		if Input.is_action_just_pressed("right"):
			client_input.right_pressed = true
		if Input.is_action_just_pressed("grapple"):
			client_input.grapple_pressed = true
		if Input.is_action_just_pressed("heavy"):
			client_input.heavy_pressed = true
		if Input.is_action_just_released("up"):
			client_input.up_pressed = false
		if Input.is_action_just_released("down"):
			client_input.down_pressed = false
		if Input.is_action_just_released("left"):
			client_input.left_pressed = false
		if Input.is_action_just_released("right"):
			client_input.right_pressed = false
		if Input.is_action_just_released("grapple"):
			client_input.grapple_pressed = false
		if Input.is_action_just_released("heavy"):
			client_input.heavy_pressed = false
		receive_client_input.rpc_id(1, inst_to_dict(client_input))
		queue_redraw()
	elif multiplayer.is_server():
		get_node("../grapple").set_visible(grapple_state)
		if grapple_state:
			power -= delta * 100 / Settings.power_time
			if (power <= 0):
				tired()
				return
		elif !tired_state && power < 100:
			power += delta * 100 / Settings.power_time
		if heavy_state:
			get_node("power").value = 100
			get_node("power").tint_progress = Color(1, 1, 1, 1)
		elif tired_state:
			get_node("power").value = 100
			get_node("power").tint_progress = Color(0.75, 0.25, 0.25, 1)
		else:
			get_node("power").value = round(power)
			get_node("power").tint_progress = Color(1, 1, 1, 0.5)

func _draw():
	if str(multiplayer.get_unique_id()) == get_parent().get_name():
		if too_far:
			draw_arc(Vector2(), Settings.max_grapple_radius, 0, 360, 360, Color(1, 1, 1, 0.5), 3)

func up(state):
	state.apply_central_force(Vector2(0, -1.5) * Settings.force_factor)

func down(state):
	state.apply_central_force(Vector2(0, 1.5) * Settings.force_factor)

func left(state):
	state.apply_central_force(Vector2(-1.5, 0) * Settings.force_factor)

func right(state):
	state.apply_central_force(Vector2(1.5, 0) * Settings.force_factor)

func jump(state):
	state.apply_central_impulse(Vector2.UP * Settings.impulse_factor)
	
func grapple():
	var nearest_collision = nearest_collision()
	if !is_freeze_enabled() && !grapple_state && !tired_state:
		if nearest_collision != Vector2.ZERO:
			too_far = false
			grapple_radius = position.distance_to(nearest_collision) + 5
			grapple_anchor = nearest_collision
			grapple_state = true
		else:
			too_far = true
	if grapple_state:
		var displacement = position - grapple_anchor
		var distance = displacement.length()
		if distance > grapple_radius:
			position = grapple_anchor + displacement.normalized() * grapple_radius
			var outgoing_velocity = linear_velocity.dot(displacement.normalized())
			if outgoing_velocity > 0:
				var force_magnitude = (outgoing_velocity / 6) ** 1.45 - 1
				var pull_force = displacement.normalized() * -force_magnitude
				linear_velocity += pull_force
		get_parent().get_node("grapple").set_point_position(0, position)
		get_parent().get_node("grapple").set_point_position(1, grapple_anchor)

func grapple_stop():
	grapple_state = false
	too_far = false

func heavy_start():
	heavy_state = true
	mass = 4

func heavy_stop():
	heavy_state = false
	mass = 1

func _on_body_entered(body):
	if multiplayer.is_server() && body is RigidBody2D && grapple_state:
		tired()
		grapple_stop()

func skin_request_completed(result, response_code, headers, body):
	if response_code == 200:
		var image = Image.new()
		var error = image.load_png_from_buffer(body)
		if error == OK:
			get_node("skin").texture = ImageTexture.create_from_image(image)
			var shader = Shader.new()
			shader.set_code("
				shader_type canvas_item;
				uniform sampler2D tex : source_color;
				uniform float radius = 0.5;
				uniform float feather = 0.0;
				uniform vec2 center = vec2(0.5, 0.5);
				void fragment() {
					float dist = distance(UV, center);
					float mask = smoothstep(radius, radius - feather, dist);
					vec4 tex_color = texture(tex, UV);
					COLOR = vec4(tex_color.rgb, tex_color.a * mask); 
				}
			")
			get_node("skin").material = ShaderMaterial.new()
			get_node("skin").material.shader = shader
			get_node("skin").material.set_shader_parameter("tex", ImageTexture.create_from_image(image))\
