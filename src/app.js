
import Paint from './tools/paint.js';

const app = new PIXI.Application();
document.body.appendChild(app.view);
const { stage } = app;

const renderTexture = PIXI.RenderTexture.create(app.screen.width, app.screen.height);

const renderTextureSprite = new PIXI.Sprite(renderTexture);
stage.addChild(renderTextureSprite);

app.stage.interactive = true;
app.stage.on('pointerdown', pointerDown);
app.stage.on('pointerup', pointerUp);
app.stage.on('pointermove', pointerMove);

// setup brush tool
let paintTool = new Paint();

let dragging = false;

function pointerMove(event) {
	if (dragging) {
		paintTool.move(app.renderer, renderTexture, event);
	}
}

function pointerDown(event) {
	dragging = true;
	paintTool.begin(app.renderer, renderTexture, event);
}

function pointerUp(event) {
	dragging = false;
	paintTool.end(app.renderer, renderTexture, event);
}
