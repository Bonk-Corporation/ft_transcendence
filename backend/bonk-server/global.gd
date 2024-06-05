extends Node

var users: Array = []
var rooms: Array = []

func add_user(user: User):
	users.append(user)
	
func remove_user(user: User):
	for room in rooms:
		if room.users.has(user):
			get_node("../main/rooms/" + room.name + "/players/" + str(user.id)).call_deferred("queue_free")
			room.users.erase(user)
			if room.users.size() == 0:
				print("Room removed: ", room.name)
				get_node("../main/rooms/" + room.name).call_deferred("queue_free")
				rooms.erase(room)
	users.erase(user)

func get_user(arg):
	if arg is int:
		for user in users:
			if user.id == arg:
				return user
	elif arg is String:
		for user in users:
			if user.username == arg:
				return user
	return null

func add_room(room: Room):
	print("Room added: ", room.name)
	rooms.append(room)
	
func remove_room(room: Room):
	print("Room removed: ", room.name)
	for user in users:
		get_node("../main/rooms/" + room.name + "/players/" + str(user.id)).call_deferred("queue_free")
		room.users.erase(user)
	get_node("../main/rooms/" + room.name).call_deferred("queue_free")
	rooms.erase(room)

func get_room(name):
	for room in rooms:
		if room.name == name:
			return room
	return null

func get_free_room_layer():
	var used_layers = []
	for room in rooms:
		used_layers.append(room.layer)
	for i in range(32):
		if i not in used_layers:
			return i
	return -1



