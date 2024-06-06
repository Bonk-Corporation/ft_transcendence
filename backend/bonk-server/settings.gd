extends Node

var server_ip: String
var server_port: int
const server_port_listen: int = 9999

var server_protocol: String
var api_ip: String
const api_port: int = 8000
var api_path: String

const force_factor: int = 400 # move force
const impulse_factor: int = 200 #jump force
const bounce: float = 0.2 # bounce factor when colliding other players
const max_grapple_radius: int = 300 # maximum grapple distance
const power_time:int = 4 # time in seconds from full endurance to tired
const tired_time:int = 5 # time in seconds of tired state
const parallax_speed:int = 100 # scroll speed of paralax background
