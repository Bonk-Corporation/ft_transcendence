extends CollisionShape2D

func _draw():
	var rect_shape = shape as RectangleShape2D;
	var color = Color(0.4, 0.4, 0.4, 1)
	draw_rect(Rect2(-rect_shape.extents, rect_shape.extents * 2.0), color)
	draw_rect(Rect2(-rect_shape.extents, rect_shape.extents * 2.0), Color(0.33, 0.33, 0.33, 1), false, 3)
	
