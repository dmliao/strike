import store from '../foundation/store.js';
import tools, { toolId } from './tools.js';
import { rgbQuantColors } from '../palette/raw_colors.js';

import UndoStack from './undo_stack.js';

let EMPTY_SPRITE = new PIXI.Sprite(PIXI.Texture.EMPTY);

class Artwork {

	constructor(element) {
		this.undo = new UndoStack(this);
		this.app = new PIXI.Application({
			width: element.offsetWidth,
			height: element.offsetHeight,
			backgroundColor: 0x111111
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

		this.new(800, 600)
		this._bindListeners();

	}

	_bindListeners() {
		// global actions
		store.listen('new', (dimensions) => {
			dimensions = dimensions = {};
			const { width, height } = dimensions;
			this.new(width || 800, height || 600);
		})

		store.listen('mirror', () => {
			this.mirrorHorizontal();
		})

		store.listen('flip', () => {
			this.flipVertical();
		})

		store.listen('save', () => {
			this.saveImage();
		})

		store.listen('import', () => {
			this.importImage();
		})

		store.listen('export', () => {
			this.exportImage();
		})
	}

	getViewport() {
		return this.viewport;
	}

	resetViewport() {
		this.viewport.scaled = 1;
		this.viewport.center = new PIXI.Point(this.renderTextureSprite.width / 2, this.renderTextureSprite.height / 2)
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

	_createSurface(width, height) {
		this.renderTexture = PIXI.RenderTexture.create(width || this.app.screen.width, height || this.app.screen.height);
		this.renderTextureSprite = new PIXI.Sprite(this.renderTexture);

		this.viewport.addChild(this.renderTextureSprite);

		this.renderTextureSprite.interactive = true;
		this.renderTextureSprite.on('pointerdown', this.pointerDown.bind(this));
		this.renderTextureSprite.on('pointerup', this.pointerUp.bind(this));
		this.renderTextureSprite.on('pointermove', this.pointerMove.bind(this));

		if (this.shader) {
			this.renderTextureSprite.filters = [this.shader]
		}

	}

	new(width, height) {
		if (!this.renderTexture) {
			this._createSurface(width, height);
		} else {
			this.resize(width, height);
			this.app.renderer.render(EMPTY_SPRITE, this.renderTexture, true, null, false);
		}

		this.undo.reset();
		this.resetViewport();
	}

	importImage() {
		const self = this; // hooray for waterfall chaining.

		const ext = 'png'
		const input = document.createElement('input')
		input.type = 'file'
		input.accept = '.png, .PNG'
		input.setAttribute('multiple', 'multiple')
		input.onchange = (e) => {
			for (const file of e.target.files) {
				if (file.name.toLowerCase().indexOf('.' + ext) < 0) { continue }

				// do something with the file.
				const reader = new FileReader()
				reader.addEventListener("load", function () {
					// convert image file to base64 string
					const img = document.createElement('img');
					img.src = reader.result;
					img.onload = () => {
							
						const q = new RgbQuant({
							palette: rgbQuantColors(),
						})

						const pixelArray = q.reduce(img);
						const newTexture = PIXI.Texture.fromBuffer(pixelArray, img.width, img.height);
						const newTextureSprite = new PIXI.Sprite(newTexture);
						self.resize(img.width, img.height);
						self.app.renderer.render(newTextureSprite, self.renderTexture, true, null, false);

						console.log('loaded image')
						self.undo.reset();
						self.resetViewport();
					} 

				}, false);
				reader.readAsDataURL(file)
			}
		}
		input.click()
	}

	saveImage() {
		this.app.renderer.extract.canvas(this.renderTexture).toBlob(function (b) {
			var a = document.createElement('a');
			document.body.append(a);
			a.download = 'strike-raw.png';
			a.href = URL.createObjectURL(b);
			a.click();
			a.remove();
		}, 'image/png');
	}

	exportImage() {
		const snapshot = new PIXI.Sprite(this.renderTexture);
		snapshot.filters = [this.shader];
		this.app.renderer.extract.canvas(snapshot).toBlob(function (b) {
			var a = document.createElement('a');
			document.body.append(a);
			a.download = 'strike-export.png';
			a.href = URL.createObjectURL(b);
			a.click();
			a.remove();
		}, 'image/png');
	}

	resize(width, height) {
		this.renderTexture.resize(width, height, true);
	}

	mirrorHorizontal() {
		const snapshotTexture = this._copyRenderTexture();
		const mirrored = new PIXI.Sprite(snapshotTexture);
		mirrored.scale.x = -1
		mirrored.position.x = this.renderTexture.width;
		this.app.renderer.render(mirrored, this.renderTexture, true, null, false)
		this.addUndoable('MIRROR', undefined, false);
	}

	flipVertical() {
		const snapshotTexture = this._copyRenderTexture();
		const mirrored = new PIXI.Sprite(snapshotTexture);
		mirrored.scale.y = -1
		mirrored.position.y = this.renderTexture.height;
		this.app.renderer.render(mirrored, this.renderTexture, true, null, false)
		this.addUndoable('FLIP', undefined, false);
	}

	_copyRenderTexture() {
		const snapshotTexture = PIXI.RenderTexture.create(this.renderTexture.width, this.renderTexture.height);
		this.app.renderer.render(this.renderTextureSprite, snapshotTexture, true, null, false);
		return snapshotTexture;
	}

	pointerMove(event) {
		if (!this.currentTool) {
			return;
		}
		if (this.dragging) {
			this.currentTool.move(this.app.renderer, this.renderTexture, event, this);
		}
	}

	pointerDown(event) {
		if (!this.currentTool) {
			return;
		}
		this.dragging = true;
		this.currentTool.begin(this.app.renderer, this.renderTexture, event, this);
	}

	pointerUp(event) {
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