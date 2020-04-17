import Paint from './paint.js'

class Eraser extends Paint {
	constructor() {
		super();
		this.blendMode = PIXI.BLEND_MODES.DST_OUT;
		this.updateBrush();
	}

	updateBrush({size, shape, color} = {}) {
		super.updateBrush({size, shape, color});
		if (this.blendMode) {
			this.brush.blendMode = this.blendMode;
		}
	}
}

export default Eraser;