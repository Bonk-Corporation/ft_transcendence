class_name User

var username: String
var skin: String
var id: int
var joined_room: bool = false
func _init(username: String, skin: String, id: int):
	self.username = username
	self.skin = skin
	self.id = id

