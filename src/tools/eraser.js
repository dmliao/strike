import Paint from './paint.js'

import storeSingleton from "../foundation/store.js";

class Eraser extends Paint {
	constructor() {
		super();
		this.blendMode = PIXI.BLEND_MODES.DST_OUT;
		this.subscribe();
		this.updateBrush();
	}

	subscribe() {
		this.brushSize = storeSingleton.get('eraser.size') || 1;
		storeSingleton.subscribe('eraser.size', (newSize) => {
			this.updateBrush({
				size: newSize
			});
		})
	}

	updateBrush({size, shape, color} = {}) {
		super.updateBrush({size, shape, color});
		if (this.blendMode) {
			this.brush.blendMode = this.blendMode;
		}
	}
}

export default Eraser;