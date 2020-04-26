// only used for undo / redo
import Tool from './base.js';

import storeSingleton from "../foundation/store.js";

class Stretch extends Tool {
	applyOperation(operation, renderer, renderTexture) {
		// apply mirror
		storeSingleton.publish('stretch', operation);
	}
}

export default Stretch;