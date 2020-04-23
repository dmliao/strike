
import Paint from '../tools/paint.js';
import Eraser from '../tools/eraser.js';
import Fill from '../tools/fill.js';

class Tools {
	constructor() {
		this.toolObjects = {
			PAINT: new Paint(),
			ERASER: new Eraser(),
			FILL: new Fill(),
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