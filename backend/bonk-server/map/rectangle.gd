extends Node2D

func _ready():
	queue_redraw() 

func _draw():
	draw_rect(Rect2(Vector2.ZERO, Vector2(2000, 5000)), Color(0.05, 0.11, 0.16, 1))
