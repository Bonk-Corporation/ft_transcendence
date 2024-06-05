extends Node2D

@export var layer : int = 0
signal game_finished(room_name, winner, scores)
var started = false
var finished = false

func start_round(message, time):
	for player in get_node("players").get_children():
		player.get_node("body").set_position(Vector2(640, 235))
		player.get_node("body").set_freeze_enabled(true)
		player.get_node("body").death_state = false
		player.get_node("body").tired_state = false
		player.get_node("body").grapple_state = false
		player.get_node("body").power = 100
	get_node("message").set_text(message)
	await get_tree().create_timer(3).timeout
	while time >= 0:
		get_node("message").set_text(str(time))
		time -= 1
		await get_tree().create_timer(1).timeout
	get_node("message").set_text("")
	for player in get_node("players").get_children():
		player.get_node("body").set_freeze_enabled(false)
	started = true
	

func _ready():
	if multiplayer.is_server():
		get_node("body").set_collision_layer(1 << layer)
		get_node("body").set_collision_mask(1 << layer)
		var physic = PhysicsMaterial.new()
		physic.set_absorbent(true)
		get_node("body").set_physics_material_override(physic)
		start_round("Ready ?", 3)

func _process(delta):
	if !multiplayer.is_server():
		get_node("background").scroll_offset += Vector2(1, 0) * Settings.parallax_speed * delta
	elif started:
		if finished:
			return
		var death_count = 0
		var winner = null
		var scores = ""
		var scores_dict = {}
		for player in get_node("players").get_children():
			scores_dict[player.get_node("body/username").get_text()] = player.get_node("body").score
			scores += player.get_node("body/username").get_text() + ": " + str(player.get_node("body").score) + "\n"
			if player.get_node("body").death_state:
				death_count += 1
			else:
				winner = player
		get_node("scores").set_text(scores)
		if !winner:
			start_round("Draw !", 3)
		elif death_count >= get_node("players").get_child_count() - 1:
			winner.get_node("body").score += 1
			if winner.get_node("body").score >= 5 || get_node("players").get_child_count() == 1:
				finished = true
				scores_dict[winner.get_node("body/username").get_text()] = winner.get_node("body").score
				game_finished.emit(get_name(), Global.get_user(winner.get_node("body/username").get_text()), scores_dict)
			else:
				start_round(winner.get_node("body/username").get_text() + " scored !", 3)
