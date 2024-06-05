class_name Room

var name: String
var layer: int
var users: Array

func _init(name: String, layer: int):
	self.name = name
	self.layer = layer
	self.users = []

func add_user(user: User):
	self.users.append(user)

func remove_user(user: User):
	self.users.erase(user)
