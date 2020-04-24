import store from '../foundation/store.js';
import tools, { toolId } from './tools.js';

import UndoStack from './undo_stack.js';

class Artwork {

	constructor(element) {
		this.undo = new UndoStack(this);
		this.app = new PIXI.Application({
			width: element.offsetWidth,
			height: element.offsetHeight
		});
		this.app.resizeTo = element;

		// create viewport
		this.viewport = new Viewport.Viewport({
			interaction: this.app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
		})

		// add the viewport to the stage
		this.app.stage.addChild(this.viewport)
		this.viewport.wheel().decelerate();

		this.renderTexture = undefined;
		this.renderTextureSprite = undefined;
		this.app.loader.add('shader', 'src/shaders/shader.frag')
			.add('palette', 'src/palette/dither-palette.png')
			.load(this.loadResources.bind(this));

		this.dragging = false;
		this.currentTool = tools.get(store.get('tool'));
		store.subscribe('tool', (newTool) => {
			this.currentTool = tools.get(newTool);
			if (newTool === toolId.MOVE) {
				this.activateMoveViewport();
			} else {
				this.deactivateMoveViewport();
			}
		});

		element.appendChild(this.app.view);

		this.createSurface(800, 600)
	}

	getViewport() {
		return this.viewport;
	}

	activateMoveViewport() {	
		// activate plugins
		this.viewport
			.drag()
			.pinch()
	}

	deactivateMoveViewport() {
		this.viewport.plugins.remove('pinch');
		this.viewport.plugins.remove('drag');
	}

	loadResources(_loader, res) {
		const texture = res.palette.texture;

		const uniforms = {
			palette: texture,
			swatchSize: 8
		}

		this.shader = new PIXI.Filter('', res.shader.data, uniforms);
		this.renderTextureSprite.filters = [this.shader]
	}

	createSurface(width, height) {
		this.renderTexture = PIXI.RenderTexture.create(width || this.app.screen.width, height || this.app.screen.height);
		this.renderTextureSprite = new PIXI.Sprite(this.renderTexture);

		this.viewport.addChild(this.renderTextureSprite);
		// this.app.stage.addChild(this.renderTextureSprite);

		this.renderTextureSprite.interactive = true;
		this.renderTextureSprite.on('pointerdown', this.pointerDown.bind(this));
		this.renderTextureSprite.on('pointerup', this.pointerUp.bind(this));
		this.renderTextureSprite.on('pointermove', this.pointerMove.bind(this));

		this.undo.reset();

		if (this.shader) {
			this.renderTextureSprite.filters = [this.shader]
		}

	}

	pointerMove (event) {
		if (!this.currentTool) {
			return;
		}
		if (this.dragging) {
			this.currentTool.move(this.app.renderer, this.renderTexture, event, this);
		}
	}

	pointerDown (event) {
		if (!this.currentTool) {
			return;
		}
		this.dragging = true;
		this.currentTool.begin(this.app.renderer, this.renderTexture, event, this);
	}

	pointerUp (event) {
		if (!this.currentTool) {
			return;
		}
		if (!this.dragging) {
			return;
		}
		this.dragging = false;
		
		if (!this.renderTextureSprite) {
			return;
		}

		this.currentTool.end(this.app.renderer, this.renderTexture, event, this);
	}

	setToSnapshot(texture) {
		const newTextureSprite = new PIXI.Sprite(texture);
		this.app.renderer.render(newTextureSprite, this.renderTexture, true, null, false);
	}
	
	addUndoable(toolName, op, createSnapshot) {
		this.undo.addUndoable(toolName, op, createSnapshot);
	}

	applySavedOperation(op) {
		const tool = tools.get(op.toolName);
		if (!tool) {
			console.log('Operation had invalid tool: ', op);
			return;
		}
		
		// TODO: apply saved operation per tool.
		tool.applyOperation(op.operation, this.app.renderer, this.renderTexture);
	}
}

export default Artwork;