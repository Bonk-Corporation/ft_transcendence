extends Control

var peer: WebSocketMultiplayerPeer = WebSocketMultiplayerPeer.new()
@export var map_scene: PackedScene
@export var player_scene: PackedScene

func _ready():
	if OS.get_environment("FT_DEBUG") == "y":
		Settings.api_ip = "localhost" 
	else:
		Settings.api_ip = "transcendence" 
	if OS.has_feature("server"):
		start_server()
	else:
		start_client()


###################### SERVER ######################

func start_server():
	peer.create_server(Settings.server_port_listen)
	multiplayer.multiplayer_peer = peer
	peer.peer_connected.connect(player_connected)
	peer.peer_disconnected.connect(player_disconnected)

func player_connected(id):
	print("Player connected: authentification...")

func player_disconnected(id):
	var user = Global.get_user(id)
	if !user:
		print("Player disconnected: unauthenticated")
		return
	print("Player disconnected: ", user.username)
	get_node("leave").request("http://" + Settings.api_ip + ":" + str(Settings.api_port) + "/api/private/leave/" + user.username, ["Authorization: " + OS.get_environment("PRIVATE_API_TOKEN")])
	Global.remove_user(user)

func game_finished(room_name, winner, scores_dict):
	var room = Global.get_room(room_name)
	for user in room.users:
		var body_data = {
			"game": "Bonk",
			"score": [scores_dict[user.username], scores_dict[winner.username]],
			"player": user.username
		}
		if user == winner:
			var second_score = 0
			for username in scores_dict.keys():
				if scores_dict[username] > second_score && scores_dict[username] != scores_dict[winner.username]:
					second_score = scores_dict[username]
			body_data = {
				"game": "Bonk",
				"score": [scores_dict[user.username], second_score],
				"player": user.username
			}
		var http = HTTPRequest.new()
		http.set_name("game_stats_" + str(user.id))
		http.request_completed.connect(game_stats_request_response.bind(user.id))
		add_child(http)
		http.request("http://" + Settings.api_ip + ":" + str(Settings.api_port) + "/api/private/game_stats", ["Authorization: " + OS.get_environment("PRIVATE_API_TOKEN")], HTTPClient.METHOD_POST, JSON.stringify(body_data))
		client_leave_room.rpc_id(user.id)
		client_message.rpc_id(user.id, winner.username + " won !")
	Global.remove_room(room)

func game_stats_request_response(result, response_code, headers, body, id):
	get_node("game_stats_" + str(id)).call_deferred("queue_free")
	
@rpc("any_peer")
func authenticate(token):
	var http = HTTPRequest.new()
	http.set_name("authenticate_" + str(multiplayer.get_remote_sender_id()))
	http.request_completed.connect(authenticate_request_completed.bind(multiplayer.get_remote_sender_id()))
	add_child(http)
	http.request("http://" + Settings.api_ip + ":" + str(Settings.api_port) + "/api/private/get_bonk_player/" + token, ["Authorization: " + OS.get_environment("PRIVATE_API_TOKEN")])

func authenticate_request_completed(result, response_code, headers, body, id):
	if response_code == 200:
		var json = JSON.parse_string(body.get_string_from_utf8())
		print("Player authenticated: ", json["name"])
		authentified_state.rpc_id(id)
		client_message.rpc_id(id, "Matchmaking...")
		if Global.get_user(json["name"]):
			client_message.rpc_id(id, "Error: You are already connected")
			peer.disconnect_peer(id)
		Global.add_user(User.new(json["name"], Settings.api_path + json["skin"], id))
	else:
		client_message.rpc_id(id, "Error: Authentification failed, please try again later")
		peer.disconnect_peer(id)
	get_node("authenticate_" + str(id)).call_deferred("queue_free")

var time = 0;

func _process(delta):
	if multiplayer.is_server():
		time += delta
		if time > 1:
			get_node("event").request("http://" + Settings.api_ip + ":" + str(Settings.api_port) + "/api/private/get_bonk_event",  ["Authorization: " + OS.get_environment("PRIVATE_API_TOKEN")])
			time = 0

func event_request_completed(result, response_code, headers, body):
	if response_code == 200:
		var json = JSON.parse_string(body.get_string_from_utf8())
		var room = Global.get_room(json["game_id"])
		if !room:
			var map = map_scene.instantiate()
			map.layer = Global.get_free_room_layer()
			if map.layer == -1:
				print("Error: ", "Can't create room ", json["game_id"], ", server instance full")
				for username in json["users"]:
					var user = Global.get_user(username)
					if !user:
						print("Warning: Unconnected user \"", username, "\" called in an event")
						continue
					client_message.rpc_id(user.id, "Error: Server instance full, please try again later")
					peer.disconnect_peer(user.id)
					return
			room = Room.new(json["game_id"], map.layer)
			Global.add_room(room)
			map.name = json["game_id"]
			map.game_finished.connect(game_finished)
			get_node("rooms").add_child(map)
		for username in json["users"]:
			var user = Global.get_user(username)
			if !user:
				print("Warning: ", "Unconnected user \"", username, "\" called in an event")
				continue
			room.add_user(user)
			client_join_room.rpc_id(user.id, json["game_id"])
			var player = player_scene.instantiate()
			player.name = str(user.id)
			player.get_node("body").username = user.username
			player.get_node("body").skin = user.skin
			get_node("rooms/" + json["game_id"] + "/players").call_deferred("add_child", player)

###################### CLIENT ######################

var join_request_callback = JavaScriptBridge.create_callback(join_request)
var externalator = JavaScriptBridge.get_interface("externalator")
var authentified = false
var join = false
signal join_request_wait_signal()

func join_request_wait():
	if authentified && join:
		get_node("join").request(Settings.api_path + "/api/bonk/join")

func join_request(args):
	join = true
	join_request_wait_signal.emit()

@rpc
func authentified_state():
	authentified = true
	join_request_wait_signal.emit()

func start_client():
	join_request_wait_signal.connect(join_request_wait)
	externalator.addGodotFunction('join_request', join_request_callback)
	Settings.server_ip = JavaScriptBridge.eval("window.location.hostname")
	if JavaScriptBridge.eval("window.location.protocol == 'https:'"):
		Settings.server_protocol = "wss://"
		Settings.server_port = 8443
		Settings.api_path = "https://" + JavaScriptBridge.eval("window.location.host")
	else:
		Settings.server_protocol = "ws://" 
		Settings.server_port = 8000
		Settings.api_path = "http://" + JavaScriptBridge.eval("window.location.host")
	peer.create_client(Settings.server_protocol + JavaScriptBridge.eval("window.location.host") + "/bonk-ws")
	multiplayer.multiplayer_peer = peer
	multiplayer.connected_to_server.connect(connected_to_server)
	multiplayer.connection_failed.connect(connection_failed)

func connected_to_server():
	get_node("token").request(Settings.api_path + "/api/set_token")

func token_request_completed(result, response_code, headers, body):
	if response_code == 200:
		client_message("Authentification...")
		var json = JSON.parse_string(body.get_string_from_utf8())
		authenticate.rpc_id(1, json["success"])
	else:
		client_message("Error: Can't connect to API, please try again later")
		peer.close()

func connection_failed():
	client_message("Error: Can't connect to server, please try again later")

@rpc
func client_message(msg):
	get_node("message").set_text(msg)

@rpc
func client_join_room(room_name):
	client_message("")
	var map = map_scene.instantiate()
	map.name = room_name
	get_node("rooms").add_child(map)

@rpc
func client_leave_room():
	get_node("rooms").get_child(0).call_deferred("queue_free")
	await get_tree().create_timer(3).timeout
	JavaScriptBridge.eval("location.reload();")


