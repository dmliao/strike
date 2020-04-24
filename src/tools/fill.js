import Tool from "./base.js";
import { flood_fill } from '../utils/flood_fill.js';
import storeSingleton from "../foundation/store.js";
import { toolId } from "../frame/tools.js";

class Fill extends Tool {
	constructor() {
		super();
		this.color = storeSingleton.get('color') || 0xffffff;
		this.toolType = toolId.FILL;

		storeSingleton.subscribe('color', (color) => {
			this.color = color;
		});
	}

	end(renderer, renderTexture, event, artwork) {
		const viewport = artwork.getViewport();
		
		const splitColor = this._toColor(this.color);

		// we don't have any alpha support in this tool, so we can automatically set alpha to max, which is 255.
		flood_fill(renderer, renderTexture, this.getX(event, viewport), this.getY(event, viewport), splitColor[0], splitColor[1], splitColor[2], 255);

		artwork.addUndoable(this.toolType, {
			color: this.color,
			x: this.getX(event, viewport),
			y: this.getY(event, viewport),
		});
	}

	_toColor(num) {
		num >>>= 0;
			var b = num & 0xFF,
				g = (num & 0xFF00) >>> 8,
				r = (num & 0xFF0000) >>> 16,
				a = ( (num & 0xFF000000) >>> 24 );
			return [r, g, b, a];
	}

	applyOperation(operation, renderer, renderTexture) {
		const splitColor = this._toColor(operation.color);
		flood_fill(renderer, renderTexture, operation.x, operation.y, splitColor[0], splitColor[1], splitColor[2], 255);
	}
}

export default Fill;