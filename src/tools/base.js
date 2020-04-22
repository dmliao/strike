class Tool {
	// renderer - the renderer to use
	// renderTexture = the texture to render to
	// event - pointer event
	// viewport - optional viewport obj
	begin(renderer, renderTexture, event, viewport) {

	}

	move(renderer, renderTexture, event, viewport) {
		// called when dragging the mouse
	}

	end(renderer, renderTexture, event, viewport) {

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
}

export default Tool;