extends Node2D

@export var collision_layer : int = 1
var counter = 6

func _ready():
	get_node("body").set_collision_layer(1 << collision_layer)
	get_node("body").set_collision_mask(1 << collision_layer)
	var physic = PhysicsMaterial.new()
	physic.set_absorbent(true)
	get_node("body").set_physics_material_override(physic)
	

@rpc("call_local")
func quit_game():
	if multiplayer.is_server():
		print("Room deleted: ", name)
	call_deferred("queue_free")

func _process(delta):
	get_node("background").scroll_offset += Vector2(1, 0) * Parameters.parallax_speed * delta
	if multiplayer.is_server() && get_node("players").get_child_count() > 0:
		if (counter > 0):
			get_node("label").set_text(str(floor(counter)))
			counter -= delta
			if floor(counter) <= 0:
				get_node("label").set_text("")
				for player in get_node("players").get_children():
					player.get_node("body").set_freeze_enabled(false)
		var nb_death = 0
		var winner = get_node("players").get_child(0)
		for child in get_node("players").get_children():
			if child.get_node("body").is_dead:
				nb_death += 1
			else:
				winner = child
		if nb_death >= get_node("players").get_child_count() - 1 && get_node("players").get_child_count() > 1:
			winner.get_node("body").wins += 1
			for child in get_node("players").get_children():
				child.get_node("body").is_dead = false
				child.get_node("body").set_freeze_enabled(true)
				child.get_node("body").endurance_time = Parameters.endurance_delay
				child.get_node("body").is_grapple = false
				child.get_node("body").tired = false
				counter = 4;
				child.get_node("body").set_position(Vector2(640, 235))
		var scores = ""
		for child in get_node("players").get_children():
			scores += child.get_node("body").get_node("pseudo").get_text() + ": " + str(child.get_node("body").wins) + "\n"
			if child.get_node("body").wins >= 5:
				get_parent().get_parent().layers[collision_layer] = false
				get_node("label").set_text(child.get_node("body").get_node("pseudo").get_text() + " won this game")
				for player in get_node("players").get_children():
					player.call_deferred("queue_free")
				rpc("quit_game")
				break
		if  get_node("players").get_child_count() == 1 && counter <= 0:
				get_parent().get_parent().layers[collision_layer] = false
				get_node("label").set_text(get_node("players").get_child(0).get_node("body").get_node("pseudo").get_text() + " won this game")
				for player in get_node("players").get_children():
					player.call_deferred("queue_free")
				rpc("quit_game")
		get_node("scores").set_text(scores)
