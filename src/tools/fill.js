import Tool from "./base.js";
import { flood_fill } from '../utils/flood_fill.js';
import storeSingleton from "../foundation/store.js";

class Fill extends Tool {
	constructor() {
		super();
		this.color = storeSingleton.get('color') || 0xffffff;

		storeSingleton.subscribe('color', (color) => {
			this.color = color;
		});
	}
	begin(renderer, renderTexture, event) {
		// nothing
	}

	move(renderer, renderTexture, event) {
		// called when dragging the mouse
	}

	end(renderer, renderTexture, event) {
		// flood fill
		function toColor(num) {
			num >>>= 0;
			var b = num & 0xFF,
				g = (num & 0xFF00) >>> 8,
				r = (num & 0xFF0000) >>> 16,
				a = ( (num & 0xFF000000) >>> 24 );
			return [r, g, b, a];
		}

		const splitColor = toColor(this.color);

		// we don't have any alpha support in this tool, so we can automatically set alpha to max, which is 255.
		flood_fill(renderer, renderTexture, event.data.global.x, event.data.global.y, splitColor[0], splitColor[1], splitColor[2], 255);
	}
}

export default Fill;