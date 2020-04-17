
import Paint from './tools/paint.js';
import Eraser from './tools/eraser.js';

const app = new PIXI.Application();
document.body.appendChild(app.view);
const { stage } = app;

const renderTexture = PIXI.RenderTexture.create(app.screen.width, app.screen.height);

const renderTextureSprite = new PIXI.Sprite(renderTexture);

const onLoaded = (_loader, res) => {
	
	const shader = new PIXI.Filter('', res.shader.data, {});
	renderTextureSprite.filters = [shader]
	
	stage.addChild(renderTextureSprite);
}

app.loader.add('shader', 'src/shaders/shader.frag')
.load(onLoaded);


app.stage.interactive = true;
app.stage.on('pointerdown', pointerDown);
app.stage.on('pointerup', pointerUp);
app.stage.on('pointermove', pointerMove);

// setup brush tool
let paintTool = new Paint();
let eraserTool = new Eraser();
let currentTool = paintTool;

let dragging = false;

// temporary tool switching
document.addEventListener('keypress', (ev) => {
	if (currentTool === paintTool) {
		currentTool = eraserTool;
	} else {
		currentTool = paintTool;
	}
	console.log(currentTool);
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
