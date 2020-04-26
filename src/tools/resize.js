// only used for undo / redo
import Tool from './base.js';

import storeSingleton from "../foundation/store.js";

class Resize extends Tool {
	applyOperation(operation, renderer, renderTexture) {
		// apply mirror
		storeSingleton.publish('resize', operation);
	}
}

export default Resize;