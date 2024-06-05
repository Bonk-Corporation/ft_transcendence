extends Node

const server_ip: String = "localhost"
const server_port: int = 9999

const api_ip: String = "localhost"
const api_port: int = 8000

const force_factor: int = 400 # move force
const impulse_factor: int = 200 #jump force
const max_grapple_radius: int = 300 # maximum grapple distance
const power_time:int = 4 # time in seconds from full endurance to tired
const tired_time:int = 5 # time in seconds of tired state
const parallax_speed:int = 100 # scroll speed of paralax background
