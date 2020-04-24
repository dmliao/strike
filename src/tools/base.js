class Tool {
	constructor() {
		this.toolType = "UNKNOWN";
	}
	// renderer - the renderer to use
	// renderTexture = the texture to render to
	// event - pointer event
	// artwork - artwork object. We can get viewport, undo manager, etc. from it.
	begin(renderer, renderTexture, event, artwork) {

	}

	move(renderer, renderTexture, event, artwork) {
		// called when dragging the mouse
	}

	end(renderer, renderTexture, event, artwork) {

	}

	// these functions map the global event position x and y to the correct position
	// on a viewport, given the viewport's translation and scaling.
	getX(event, viewport) {
		if (!viewport) {
			return Math.floor(event.data.global.x);
		}

		return Math.floor(event.data.global.x / viewport.scaled + viewport.corner.x)
	}

	getY(event, viewport) {
		if (!viewport) {
			return Math.floor(event.data.global.y);
		}

		return Math.floor(event.data.global.y / viewport.scaled + viewport.corner.y)
	}

	applyOperation(operation, renderer, renderTexture) {
		console.log('ERROR: undo and redo not yet implemented for this tool', operation);
	}
}

export default Tool;