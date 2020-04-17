
const app = new PIXI.Application();
document.body.appendChild(app.view);
const { stage } = app;

let brushsize = 1;

// prepare circle texture, that will be our brush
const brush = new PIXI.Graphics();
brush.beginFill(0xffffff);
//brush.drawCircle(0, 0, );
brush.drawRect(-Math.ceil(brushsize/2), -Math.ceil(brushsize/2), brushsize, brushsize);
brush.endFill();

// connecting line
const connecting = new PIXI.Graphics();
connecting.lineStyle(2, 0xffffff, 1)
			.moveTo(0, 0)
			.lineTo(400, 400)

const renderTexture = PIXI.RenderTexture.create(app.screen.width, app.screen.height);

const renderTextureSprite = new PIXI.Sprite(renderTexture);
stage.addChild(renderTextureSprite);

app.stage.interactive = true;
app.stage.on('pointerdown', pointerDown);
app.stage.on('pointerup', pointerUp);
app.stage.on('pointermove', pointerMove);

let dragging = false;

let prevPoint;
function pointerMove(event) {
	if (dragging) {
		brush.position.copyFrom(event.data.global);
		app.renderer.render(brush, renderTexture, false, null, false);

		if (prevPoint) {
			connecting.clear();
			connecting.lineStyle(brushsize, 0xffffff, 1);
			connecting.moveTo(prevPoint.x,prevPoint.y).lineTo(brush.position.x, brush.position.y)
			app.renderer.render(connecting, renderTexture, false, null, false);
		}

		prevPoint = new PIXI.Point(brush.position.x, brush.position.y);
	}
}

function pointerDown(event) {
	dragging = true;
	pointerMove(event);
}

function pointerUp(event) {
	app.renderer.render(brush, renderTexture, false, null, false);
	prevPoint = undefined;
	dragging = false;
}
