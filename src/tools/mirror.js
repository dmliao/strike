// only used for undo / redo
import Tool from './base.js';

import storeSingleton from "../foundation/store.js";

class Mirror extends Tool {
	applyOperation(operation, renderer, renderTexture) {
		// apply mirror
		storeSingleton.publish('mirror');
	}
}

export default Mirror;