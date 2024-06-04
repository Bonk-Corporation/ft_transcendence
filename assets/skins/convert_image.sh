#!/bin/sh

image=${1?Missing image}
convert \
	-resize 512x512\^ \
	-gravity Center \
	-extent 512x512 \
	-format png \
	"$image" "${image%%.*}.png"
