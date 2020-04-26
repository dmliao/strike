// 16 colors, all of which are very visually distinct so that the shader can later on work its magic
export const colors = [
	0x000000,
	0x111111,
	0x222222,
	0x333333,
	0x444444,
	0x555555,
	0x666666,
	0x777777,
	0x888888,
	0x999999,
	0xAAAAAA,
	0xBBBBBB,
	0xCCCCCC,
	0xDDDDDD,
	0xEEEEEE,
	0xFFFFFF
];

export const rgbQuantColors = () => {
	const _toColor = (num) => {
		num >>>= 0;
			var b = num & 0xFF,
				g = (num & 0xFF00) >>> 8,
				r = (num & 0xFF0000) >>> 16;
			return [r, g, b];
	}

	const q = [];
	for (let color of colors) {
		q.push(_toColor(color));
	}

	return q;
}