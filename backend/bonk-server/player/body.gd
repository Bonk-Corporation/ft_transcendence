extends RigidBody2D

@export var color : Color
@export var too_far : bool = false
@export var wins : int = 0
@export var is_dead : bool = false
@export var skin : String

class ClientInput:
	var up_pressed : bool = false
	var down_pressed : bool = false
	var left_pressed : bool = false
	var right_pressed : bool = false
	var grapple_pressed : bool = false
	var heavy_pressed : bool = false

@export var endurance_time = Parameters.endurance_delay
var tired_time = 0
var client_input = ClientInput.new()
var radius = 0
@export var is_grapple = false
@export var tired = false
var heavy = false
var anchor = Vector2.ZERO

func circular_coordinates(angle):
	var angle_radians = deg_to_rad(angle)
	var x = Parameters.max_radius * cos(angle_radians)
	var y = Parameters.max_radius * sin(angle_radians)
	return Vector2(x, y)

func get_nearest_collision():
	var nearest_collision_distance = Parameters.max_radius + 1
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
	collision_layer = 1 << get_parent().get_parent().get_parent().collision_layer
	collision_mask = 1 << get_parent().get_parent().get_parent().collision_layer
	var physic = PhysicsMaterial.new()
	physic.bounce = 0.2
	set_physics_material_override(physic)
	var request = HTTPRequest.new()
	add_child(request)
	request.request_completed.connect(on_request_completed)
	request.request(skin)
	if Instance.id != 1:
		lock_rotation = true
	for angle in range(361):
		var raycast = RayCast2D.new()
		raycast.collide_with_areas = true
		raycast.collide_with_bodies = false
		raycast.target_position = circular_coordinates(angle)
		raycast.name = "raycast_" + str(angle)
		add_child(raycast)
		raycast.position = Vector2.ZERO

func _integrate_forces(state):
	if Instance.id == 1:
		if position.y > 1000:
			linear_velocity = Vector2.ZERO
			is_dead = true
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

func _process(delta):
	if get_parent().name == str(Instance.id):
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
		rpc("receive_client_input", inst_to_dict(client_input))
		queue_redraw()
	elif Instance.id == 1:
		get_parent().get_node("grapple").set_visible(is_grapple)
		if is_grapple:
			endurance_time = endurance_time - delta
			if (endurance_time <= 0):
				tired = true
				grapple_stop()
		elif tired:
			if tired_time <  Parameters.tired_delay:
				tired_time = tired_time + delta
			else:
				tired_time = 0
				tired = false
		else:
			if endurance_time < Parameters.endurance_delay:
				endurance_time = endurance_time + delta
		if heavy:
			get_node("power").value = 100
			get_node("power").tint_progress = Color(1, 1, 1, 1)
		elif tired:
			get_node("power").value = 100
			get_node("power").tint_progress = Color(0.75, 0.25, 0.25, 1)
		else:
			get_node("power").value = round(endurance_time * 100 / Parameters.endurance_delay)
			get_node("power").tint_progress = Color(1, 1, 1, 0.5)

func _draw():
	if get_parent().name == str(Instance.id):
		if too_far:
			draw_arc(Vector2(), Parameters.max_radius, 0, 360, 360, Color(1, 1, 1, 0.5), 3)

func up(state):
	state.apply_central_force(Vector2(0, -1.5) * Parameters.force_factor)

func down(state):
	state.apply_central_force(Vector2(0, 1.5) * Parameters.force_factor)

func left(state):
	state.apply_central_force(Vector2(-1.5, 0) * Parameters.force_factor)

func right(state):
	state.apply_central_force(Vector2(1.5, 0) * Parameters.force_factor)

func jump(state):
	state.apply_central_impulse(Vector2.UP * Parameters.impulse_factor)
	
func grapple():
	var nearest_collision = get_nearest_collision()
	if !is_grapple && !tired:
		if nearest_collision != Vector2.ZERO:
			too_far = false
			radius = position.distance_to(nearest_collision) + 5
			anchor = nearest_collision
			is_grapple = true
		else:
			too_far = true
	if self.is_grapple:
		var displacement = position - anchor
		var distance = displacement.length()
		if distance > radius:
			position = anchor + displacement.normalized() * radius
			var outgoing_velocity = linear_velocity.dot(displacement.normalized())
			if outgoing_velocity > 0:
				var force_magnitude = (outgoing_velocity / 6) ** 1.45 - 1
				var pull_force = displacement.normalized() * -force_magnitude
				linear_velocity += pull_force
		get_parent().get_node("grapple").set_point_position(0, position)
		get_parent().get_node("grapple").set_point_position(1, anchor)

func grapple_stop():
	is_grapple = false
	too_far = false

func heavy_start():
	heavy = true
	mass = 4

func heavy_stop():
	heavy = false
	mass = 1

func _on_body_entered(body):
	if multiplayer.is_server() && body.name == "body" && is_grapple:
		tired = true
		endurance_time = 0
		grapple_stop()

func on_request_completed(result, response_code, headers, body):
	if response_code == 200:
		var image = Image.new()
		var error = image.load_png_from_buffer(body)
		if error == OK:
			get_node("skin").texture = ImageTexture.create_from_image(image)	 
