shader_type canvas_item;

amt flottant uniforme:hint_range(0.0, 1.0);

fragment vide()
{
si (distance(UV, vec2(0.5,0.5)) > amt/2.0)
{
COULEUR = vec4(0.0);
}
autre
{
COULEUR = texture(TEXTURE,UV);
}
}