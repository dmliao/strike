
import Paint from '../tools/paint.js';
import Eraser from '../tools/eraser.js';
import Fill from '../tools/fill.js';
import Mirror from '../tools/mirror.js';
import Flip from '../tools/flip.js';
import Stretch from '../tools/stretch.js';
import Resize from '../tools/resize.js';

class Tools {
	constructor() {
		this.toolObjects = {
			PAINT: new Paint(),
			ERASER: new Eraser(),
			FILL: new Fill(),
			MIRROR: new Mirror(),
			FLIP: new Flip(),
			STRETCH: new Stretch(),
			RESIZE: new Resize(),
		}
	}
	get(toolName) {
		return this.toolObjects[toolName];
	}
}

export const toolId = {
	PAINT: 'PAINT',
	ERASER: 'ERASER',
	FILL: 'FILL',
	MOVE: 'MOVE'
}

// singleton
const tools = new Tools();
Object.freeze(tools);

export default tools;