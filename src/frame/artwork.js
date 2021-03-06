import store from '../foundation/store.js';
import tools, { toolId } from './tools.js';
import { rgbQuantColors } from '../palette/raw_colors.js';

import UndoStack from './undo_stack.js';
import Autosave from './autosave.js';

let EMPTY_SPRITE = new PIXI.Sprite(PIXI.Texture.EMPTY);

class Artwork {

	constructor(element) {
		store.update('dirty', false);

		this.undo = new UndoStack(this);
		this.autosave = new Autosave(this);

		this.app = new PIXI.Application({
			width: element.offsetWidth,
			height: element.offsetHeight,
			backgroundColor: 0x1b1b1b,

			// this ensures that we don't redraw the canvas every frame.
			// however, this also means that we need to call this.app.ticker.update() 
			// every time the view changes
			// (e.g. when we paint on the canvas, or when we move the view)
			// so that the app knows to redraw it. The `render` function is provided to render
			// something onto the canvas *and* update the ticker immediately afterwards.
			autoStart: false 
		});

		this.app.resizeTo = element;

		// create viewport
		this.viewport = new Viewport.Viewport({
			interaction: this.app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
		})

		// add the viewport to the stage
		this.app.stage.addChild(this.viewport)
		this.viewport.wheel().decelerate();

		// we need to redraw the surface when the viewport moves so that 
		// we see the canvas's new position
		this.viewport.on('moved', () => {
			this.app.ticker.update();
		})

		this.renderTexture = undefined;
		this.renderTextureSprite = undefined;

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
		this.element = element;

		const defaultWidth = element.offsetWidth;
		const defaultHeight = element.offsetHeight;

		let params = (new URL(document.location)).searchParams;
		let w = parseInt(params.get("w") || 0, 10) || defaultWidth;
		let h = parseInt(params.get("h") || 0, 10) || defaultHeight;

		this.new(w, h);
		this._bindListeners();

		window.addEventListener('resize', () => {
			// update the canvas so we get the full viewport
			this.app.ticker.update();
		});

		// load autosave, if we have one
		const autosaved = this.autosave.load()
		if (autosaved) {
			this._loadImage(autosaved)
		} 
	}

	_bindListeners() {
		// global actions
		store.listen('new', (dimensions) => {
			dimensions = dimensions || store.get('dimensions') || {};
			const { width, height } = dimensions;
			this.autosave.clear();
			this.new(width || 800, height || 600);
		})
		
		store.listen('new_fit', () => {
			this.autosave.clear();
			this.new(this.element.offsetWidth, this.element.offsetHeight);
		})

		store.listen('resize', (dim) => {
			this.resize(dim.width, dim.height);
		})

		store.listen('stretch', (dim) => {
			this.stretch(dim.width, dim.height);
		})

		store.listen('center', () => {
			this.resetViewport();
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

		store.listen('on_undo_complete', () => {
			this.autosave.save();
		})

		store.listen('on_redo_complete', () => {
			this.autosave.save();
		})

		store.subscribe('resources', (res) => {
			this._onLoadResources(res);
		})
	}

	getViewport() {
		return this.viewport;
	}

	resetViewport() {
		this.viewport.scaled = 1;
		this.viewport.left = - this.app.renderer.width / 2 + this.renderTextureSprite.width / 2;
		this.viewport.top = - this.app.renderer.height / 2 + this.renderTextureSprite.height / 2;
		this.app.ticker.update();
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

	_onLoadResources(res) {
		this.shader = res.shader;
		this.renderTextureSprite.filters = [this.shader];
		this.app.ticker.update();
	}

	_createSurface(width, height) {
		this.renderTexture = PIXI.RenderTexture.create(width || this.app.screen.width, height || this.app.screen.height);
		this.renderTextureSprite = new PIXI.Sprite(this.renderTexture);

		this.viewport.addChild(this.renderTextureSprite);

		if (!this.app.stage.interactive) {
			this.app.stage.interactive = true;
			this.app.stage.on('pointerdown', this.pointerDown.bind(this));
			this.app.stage.on('pointerup', this.pointerUp.bind(this));
			this.app.stage.on('pointerupoutside', this.pointerUp.bind(this));
			this.app.stage.on('pointermove', this.pointerMove.bind(this));
		}

		if (this.shader) {
			this.renderTextureSprite.filters = [this.shader]
		}

		this.app.ticker.update();

	}

	new(width, height) {
		if (!this.renderTexture) {
			this._createSurface(width, height);
			store.update('dimensions', {
				width,
				height
			})
		} else {
			this.resize(width, height);
			this.render(EMPTY_SPRITE, this.renderTexture, true);
		}

		store.update('dirty', false);

		this.undo.reset();
		this.resetViewport();
	}

	importImage() {
		console.log('begin import image')
		const self = this; // hooray for waterfall chaining.

		const ext = ['png', 'jpg', 'jpeg']
		let input = document.getElementById('hidden').getElementsByTagName('INPUT')[0]
		if (!input) {
			input = document.createElement('input')
			document.getElementById('hidden').appendChild(input);

			input.type = 'file'
			input.accept = '.png, .jpg, .jpeg'
			input.setAttribute('multiple', 'multiple')
			input.addEventListener('change', (e) => {
				for (const file of e.target.files) {
					const pieces = file.name.toLowerCase().split('.')
					const fileExt = pieces[pieces.length - 1]
					if (ext.indexOf(fileExt) < 0) {
						console.log('Loaded an invalid file', file.name)
						continue
					}

					// do something with the file.
					const reader = new FileReader()
					reader.addEventListener("load", function (ev) {
						self._loadImage(reader.result, () => {
							document.getElementById('hidden').removeChild(input)
						});
					}, false);
					reader.readAsDataURL(file)
				}
			});
		}
		input.click()
	}

	_loadImage(imgSrc, callback) {
		const self = this;
		// convert image file to base64 string
		const img = new Image();
		img.src = imgSrc;
		img.onload = (ev2) => {
			const q = new RgbQuant({
				palette: rgbQuantColors(),
			})

			const pixelArray = q.reduce(img);
			const newTexture = PIXI.Texture.fromBuffer(pixelArray, img.width, img.height);
			const newTextureSprite = new PIXI.Sprite(newTexture);
			self.resize(img.width, img.height);
			self.app.renderer.render(newTextureSprite, self.renderTexture, true, null, false);

			self.undo.reset();

			// reset viewport will update the ticker and refresh the view, 
			// so we don't have to do it again.
			self.resetViewport();
			if (callback) {
				callback();
			}
		}
	}

	getCanvas() {
		return this.app.renderer.extract.canvas(this.renderTexture);
	}

	saveImage() {
		this.getCanvas().toBlob(function (b) {
			const timestamp = Date.now().toString();
			var a = document.createElement('a');
			document.body.append(a);
			a.download = `strike-raw-${timestamp}.png`;
			a.href = URL.createObjectURL(b);
			a.click();
			a.remove();
			store.update('dirty', false);
		}, 'image/png');
	}

	exportImage() {
		const snapshot = new PIXI.Sprite(this.renderTexture);
		snapshot.filters = [this.shader];
		this.app.renderer.extract.canvas(snapshot).toBlob(function (b) {
			const timestamp = Date.now().toString();
			var a = document.createElement('a');
			document.body.append(a);
			a.download = `strike-export-${timestamp}.png`;
			a.href = URL.createObjectURL(b);
			a.click();
			a.remove();
		}, 'image/png');
	}

	resize(width, height) {
		if (!this.renderTexture) {
			return;
		}
		if (width === this.renderTexture.width && height === this.renderTexture.height) {
			return; // do nothing
		}
		store.update('dimensions', {
			width,
			height
		})

		const snapshotTexture = this._copyRenderTexture();
		this.renderTexture.resize(width, height, true);
		this.render(new PIXI.Sprite(snapshotTexture), this.renderTexture, true);
		this.addUndoable('RESIZE', {
			width,
			height
		})
	}

	stretch(width, height) {
		if (!this.renderTexture) {
			return;
		}
		if (width === this.renderTexture.width && height === this.renderTexture.height) {
			return; // do nothing
		}
		store.update('dimensions', {
			width,
			height
		})

		const snapshotTexture = this._copyRenderTexture();
		const stretchedSnapshot = new PIXI.Sprite(snapshotTexture)
		stretchedSnapshot.scale.x = width / this.renderTexture.width;
		stretchedSnapshot.scale.y = height / this.renderTexture.height;
		this.renderTexture.resize(width, height, true);
		this.render(stretchedSnapshot, this.renderTexture, true);
		this.addUndoable('STRETCH', {
			width,
			height
		});
	}

	mirrorHorizontal() {
		const snapshotTexture = this._copyRenderTexture();
		const mirrored = new PIXI.Sprite(snapshotTexture);
		mirrored.scale.x = -1
		mirrored.position.x = this.renderTexture.width;
		this.render(mirrored, this.renderTexture, true);
		this.addUndoable('MIRROR', undefined, false);
	}

	flipVertical() {
		const snapshotTexture = this._copyRenderTexture();
		const mirrored = new PIXI.Sprite(snapshotTexture);
		mirrored.scale.y = -1
		mirrored.position.y = this.renderTexture.height;
		this.render(mirrored, this.renderTexture, true);
		this.addUndoable('FLIP', undefined, false);
	}

	_copyRenderTexture() {
		const snapshotTexture = PIXI.RenderTexture.create(this.renderTexture.width, this.renderTexture.height);
		const snapSprite = new PIXI.Sprite(this.renderTexture);
		this.app.renderer.render(snapSprite, snapshotTexture, true, null, false);
		return snapshotTexture;
	}

	pointerMove(event) {
		if (!this.currentTool) {
			return;
		}
		if (this.dragging) {
			this.currentTool.move(this.app.renderer, this.renderTexture, event, this);
			// TODO: we can make this more efficient by only calling update on the tools that actually perform
			// a render. This involves restructuring some logic, though.
			this.app.ticker.update();
		}
	}

	pointerDown(event) {
		if (!this.currentTool) {
			return;
		}
		this.dragging = true;
		this.currentTool.begin(this.app.renderer, this.renderTexture, event, this);
		// TODO: we can make this more efficient by only calling update on the tools that actually perform
			// a render. This involves restructuring some logic, though.
		this.app.ticker.update();
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
		// TODO: we can make this more efficient by only calling update on the tools that actually perform
		// a render. This involves restructuring some logic, though.
		this.app.ticker.update();
	}

	setToSnapshot(texture) {
		const newTextureSprite = new PIXI.Sprite(texture);
		if (this.renderTexture.width !== texture.width || this.renderTexture.height !== texture.height) {
			this.renderTexture.resize(texture.width, texture.height, true);
		}
		this.render(newTextureSprite, this.renderTexture, true);
	}

	addUndoable(toolName, op, createSnapshot) {
		this.undo.addUndoable(toolName, op, createSnapshot);
		this.autosave.save();
		store.update('dirty', true);
	}

	applySavedOperation(op) {
		const tool = tools.get(op.toolName);
		if (!tool) {
			console.log('Operation had invalid tool: ', op);
			return;
		}

		// TODO: apply saved operation per tool.
		tool.applyOperation(op.operation, this.app.renderer, this.renderTexture);
		this.app.ticker.update();
	}

	render(obj, texture, redraw) {
		this.app.renderer.render(obj, texture, redraw, null, false);
		this.app.ticker.update();
	}
}

export default Artwork;