function bresenham_line(x1, y1, x2, y2, callback) {
	// Bresenham's line algorithm
	x1=~~x1, x2=~~x2, y1=~~y1, y2=~~y2;
	
	const dx = Math.abs(x2 - x1);
	const dy = Math.abs(y2 - y1);
	const sx = (x1 < x2) ? 1 : -1;
	const sy = (y1 < y2) ? 1 : -1;
	let err = dx - dy;
	
	// eslint-disable-next-line no-constant-condition
	while(true){
		callback(x1, y1);
		
		if(x1===x2 && y1===y2) break;
		const e2 = err*2;
		if(e2 >-dy){ err -= dy; x1 += sx; }
		if(e2 < dx){ err += dx; y1 += sy; }
	}
}