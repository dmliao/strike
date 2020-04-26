// only used for undo / redo
import Tool from './base.js';

import storeSingleton from "../foundation/store.js";

class Flip extends Tool {
	applyOperation(operation, renderer, renderTexture) {
		// apply mirror
		storeSingleton.publish('flip');
	}
}

export default Flip;