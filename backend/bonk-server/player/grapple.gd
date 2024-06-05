extends Line2D

func _process(_delta):
	queue_redraw()

func _draw():
	if is_visible():
		draw_circle(get_point_position(1), 4, Color(1, 1, 1, 0.5))
