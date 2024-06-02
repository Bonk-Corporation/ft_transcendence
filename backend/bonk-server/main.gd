extends Control

var peer: WebSocketMultiplayerPeer = WebSocketMultiplayerPeer.new()
@export var map_scene: PackedScene
@export var player_scene: PackedScene
@export var layers = []
var time = 0
var users = []

class User:
	var username: String
	var skin: String
	var id: int
	func _init(username: String, id: int, skin: String):
		self.username = username
		self.id = id
		self.skin = skin

func get_user_by_username(username):
	for user in users:
		if user.username == username:
			return user
	return null

func get_user_by_id(id):
	for user in users:
		if user.id == id:
			return user
	return null

func _ready():
	if OS.has_feature("server"):
		for i in range(32):
			layers.append(false)
		peer.create_server(9999)
		Instance.id = peer.get_unique_id()
		multiplayer.multiplayer_peer = peer
		peer.peer_connected.connect(player_connected)
		peer.peer_disconnected.connect(player_disconnected)
	else:
		peer.create_client("ws://localhost:9999")
		multiplayer.multiplayer_peer = peer
		multiplayer.connected_to_server.connect(connected_to_server)
		multiplayer.connection_failed.connect(connection_failed)

func player_connected(_id):
	print("Player connected: authentification...")

func player_disconnected(id):
	var user = get_user_by_id(id)
	if !user:
		print("Player disconnected: unauthenticated")
		return
	print("Player disconnected: ", user.username)
	for room in get_node("rooms").get_children():
		if room.get_node("players").has_node(str(id)):
			if room.get_node("players").get_child_count() == 1:
				print("Room deleted: ", room.name)
				layers[room.collision_layer] = false
				room.call_deferred("queue_free")
			else:
				room.get_node("players").get_node(str(id)).call_deferred("queue_free")
	for i in range(users.size()):
		if (users[i].id == id):
			users.erase(i)
			break

func connected_to_server():
	info_label("Connecting to API...")
	Instance.id = peer.get_unique_id()
	var request = HTTPRequest.new()
	request.request_completed.connect(set_token_response)
	add_child(request)
	request.request("http://localhost:8000/api/set_token")

func connection_failed():
	info_label("Error: Can't connect to server, please try again later")

@rpc
func info_label(msg):
	get_node("label").set_text(msg)

@rpc
func join_room(room):
	info_label("")
	var map = map_scene.instantiate()
	map.name = room
	get_node("rooms").add_child(map)

@rpc
func close_connection():
	peer.close()

@rpc("any_peer")
func send_token(sender_id, token):
	if multiplayer.is_server():
		var request = HTTPRequest.new()
		request.set_name(str(sender_id))
		request.request_completed.connect(get_bonk_player_response.bind(sender_id))
		add_child(request)
		request.request("http://localhost:8000/api/private/get_bonk_player/" + token, ["Authorization: " + OS.get_environment("PRIVATE_API_TOKEN")])
	
func _process(delta):
	if multiplayer.is_server():
		if time > 1:
			time = 0
			$http.request("http://localhost:8000/api/private/get_bonk_event",  ["Authorization: " + OS.get_environment("PRIVATE_API_TOKEN")])
		else:
			time += delta

func set_token_response(result, response_code, headers, body):
	if response_code == 200:
		info_label("Authentification...")
		var json = JSON.parse_string(body.get_string_from_utf8())
		if !json.has("error"):
			rpc("send_token", Instance.id, json["success"])
	else:
		info_label("Error: Can't connect to API, please try again later")
		close_connection()

func get_bonk_player_response(result, response_code, headers, body, id):
	if response_code == 200:
		info_label.rpc_id(id, "Matchmaking...")
		var json = JSON.parse_string(body.get_string_from_utf8())
		if !json.has("error"):
			print("Player authenticated: ", json["name"])
			users.append(User.new(json["name"], id, json["skin"]))
	else:
		info_label.rpc_id(id, "Error: Authentification failed, please try again later")
		close_connection.rpc_id(id)
	get_node(str(id)).call_deferred("queue_free")

func get_bonk_events_response(result, response_code, headers, body):
	if response_code == 200:
		var json = JSON.parse_string(body.get_string_from_utf8())
		if !get_node("rooms").has_node(json["game_id"]):
			var map = map_scene.instantiate()
			for i in range(32):
				if !layers[i]:
					map.collision_layer = i;
					layers[i] = true
					break
				if i == 31:
					print("Error: ", "Can't create room ", json["game_id"], ", server instance full")
					for username in json["users"]:
						var user = get_user_by_username(username)
						if !user:
							print("Error: ", "Unconnected user \"", username, "\" called in an event")
							continue
						info_label.rpc_id(user.id, "Error: Server full, please try again later")
						close_connection().rpc_id(user.id)
					return
			print("Room created: ", json["game_id"])
			map.name = json["game_id"]
			get_node("rooms").add_child(map)
		for username in json["users"]:
			var player = player_scene.instantiate()
			var user = get_user_by_username(username)
			if !user:
				print("Error: ", "Unconnected user \"", username, "\" called in an event")
				continue
			join_room.rpc_id(user.id, json["game_id"])
			player.name = str(user.id)
			player.get_node("body").skin = user.skin
			player.get_node("body").get_node("pseudo").set_text(username)
			get_node("rooms").get_node(json["game_id"]).get_node("players").call_deferred("add_child", player)
	else:
		pass
