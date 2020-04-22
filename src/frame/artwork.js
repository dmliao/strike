import store from '../foundation/store.js';
import tools, { toolId } from './tools.js';

class Artwork {

	constructor(element) {
		this.app = new PIXI.Application();
		this.app.resizeTo = element;

		// TODO: this is creating scrollbars. Do we still need this?
		// this.app.resize();

		// create viewport
		this.viewport = new Viewport.Viewport({
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			worldWidth: 1000,
			worldHeight: 1000,

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
			console.log(this.currentTool)
			if (newTool === toolId.MOVE) {
				this.activateMoveViewport();
			} else {
				this.deactivateMoveViewport();
			}
		});

		element.appendChild(this.app.view);

		this.createSurface(400, 400)
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

		this.renderTextureSprite.interactive = true;
		this.renderTextureSprite.on('pointerdown', this.pointerDown);
		this.renderTextureSprite.on('pointerup', this.pointerUp);
		this.renderTextureSprite.on('pointermove', this.pointerMove);

		if (this.shader) {
			this.renderTextureSprite.filters = [this.shader]
		}

	}

	pointerMove = (event) => {
		if (!this.currentTool) {
			return;
		}
		if (this.dragging) {
			this.currentTool.move(this.app.renderer, this.renderTexture, event, this.viewport);
		}
	}

	pointerDown = (event) => {
		if (!this.currentTool) {
			return;
		}
		this.dragging = true;
		this.currentTool.begin(this.app.renderer, this.renderTexture, event, this.viewport);
	}

	pointerUp = (event) => {
		if (!this.currentTool) {
			return;
		}
		this.dragging = false;
		
		if (!this.renderTextureSprite) {
			return;
		}

		this.currentTool.end(this.app.renderer, this.renderTexture, event, this.viewport);
	}
}

export default Artwork;