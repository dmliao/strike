const radtodeg = function(radians) {
	return radians * 180 / Math.PI;
}

export const point_direction = (x1, y1, x2, y2) => {
	return -radtodeg(Math.atan(y1 - y2, x1 - x2)) + 180;
}