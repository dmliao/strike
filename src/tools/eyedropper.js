import Tool from "./base.js";
import storeSingleton from "../foundation/store.js";
import { toolId } from "../frame/tools.js";

class Eyedropper extends Tool {
	constructor() {
		super();
		this.color = storeSingleton.get('color') || 0xffffff;

		storeSingleton.subscribe('color', (color) => {
			this.color = color;
		});
	}

	end(renderer, renderTexture, event, artwork) {
		const viewport = artwork.getViewport();
		
		const id = renderer.extract.pixels(renderTexture);

		const x = this.getX(event, viewport)
		const y = this.getY(event, viewport)
		let pixel_pos = (y*renderTexture.width + x) * 4;
		const r = id[pixel_pos+0];
		const g = id[pixel_pos+1];
		const b = id[pixel_pos+2];
		const a = id[pixel_pos+3];

		storeSingleton.update('color', this._fromColor(r,g,b,256))
		storeSingleton.update('tool', toolId.PAINT)
	}

	_fromColor(red, green, blue, alpha) {
		var r = red & 0xFF;
		var g = green & 0xFF;
		var b = blue & 0xFF;
		var a = alpha & 0xFF;

		// var rgb = (r << 24 >>> 0) + (g << 16 >>> 0) + (b << 8 >>> 0) + (a);
		var rgb = (r << 16 >>> 0) + (g << 8 >>> 0) + (b >>> 0);
		return rgb
	}
}

export default Eyedropper;