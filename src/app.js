
import { html, render } from '/node_modules/htm/preact/standalone.mjs'

import store from './foundation/store.js';

import Paint from './tools/paint.js';
import Eraser from './tools/eraser.js';

import { Palette } from './view/palette.js';
import Fill from './tools/fill.js';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.RENDER_OPTIONS.antialias = false;
PIXI.settings.ROUND_PIXELS = true;
PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.OFF;

const app = new PIXI.Application();
document.body.appendChild(app.view);
const { stage } = app;

// dummy
window.stage = stage;

const renderTexture = PIXI.RenderTexture.create(app.screen.width, app.screen.height);

const renderTextureSprite = new PIXI.Sprite(renderTexture);

const onLoaded = (_loader, res) => {
	const texture = res.palette.texture;
		
	const uniforms = {
		palette: texture, 
		swatchSize: 8
	}
		
	const shader = new PIXI.Filter('', res.shader.data, uniforms);
	renderTextureSprite.filters = [shader]
	
	stage.addChild(renderTextureSprite);
}

app.loader.add('shader', 'src/shaders/shader.frag')
	.add('palette', 'src/palette/dither-palette.png')
	.load(onLoaded);


app.stage.interactive = true;
app.stage.on('pointerdown', pointerDown);
app.stage.on('pointerup', pointerUp);
app.stage.on('pointermove', pointerMove);

// setup brush tool
let paintTool = new Paint();
let eraserTool = new Eraser();
let fillTool = new Fill();

let currentTool = paintTool;

store.update('tool', paintTool);
store.subscribe('tool', (newTool) => {
	currentTool = newTool;
})

store.subscribe('color', (color) => {
	paintTool.updateBrush({ color });
})

let dragging = false;

// temporary tool switching
document.addEventListener('keypress', (ev) => {
	if (store.get('tool') === paintTool) {
		store.update('tool', eraserTool)
	} else if (store.get('tool') === eraserTool) {
		store.update('tool', fillTool)
	} else {
		store.update('tool', paintTool)
	}
})

function pointerMove(event) {
	if (dragging) {
		currentTool.move(app.renderer, renderTexture, event);
	}
}

function pointerDown(event) {
	dragging = true;
	currentTool.begin(app.renderer, renderTexture, event);
}

function pointerUp(event) {
	dragging = false;
	currentTool.end(app.renderer, renderTexture, event);
}

render(html`<div><${Palette} /></div>`, document.getElementById('ui'));