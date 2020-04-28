import Paint from './paint.js'

import storeSingleton from "../foundation/store.js";
import { toolId } from '../frame/tools.js';

class Eraser extends Paint {
	constructor() {
		super();
		this.blendMode = PIXI.BLEND_MODES.DST_OUT;
		this.toolType = toolId.ERASER;
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

		this.brushShape = storeSingleton.get('eraser.shape') || 'flat';
		storeSingleton.subscribe('eraser.shape', (newShape) => {
			this.updateBrush({
				shape: newShape
			});
		})

		storeSingleton.update('eraser.shape', this.brushShape);
	}

	updateBrush({size, shape, color} = {}) {
		super.updateBrush({size, shape, color});
		if (this.blendMode) {
			this.brush.blendMode = this.blendMode;
			this.lineBrush.blendMode = this.blendMode;
		}
	}

	_updateBrushTemporary(size, shape, color) {
		super._updateBrushTemporary(size, shape, color);
		if (this.blendMode) {
			this.brush.blendMode = this.blendMode;
			this.lineBrush.blendMode = this.blendMode;
		}
	}
}

export default Eraser;