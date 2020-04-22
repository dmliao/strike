import Tool from './base.js';
import { bresenham } from '../utils/bresenham.js';
import { point_direction } from '../utils/point_direction.js';

class Paint extends Tool {
	constructor() {
		super();
		this.previousPoint = null;
		this.brushSize = 10;
		this.brushShape = "flat"; // square or flat or round
		this.color = 0xffffff;

		// special brush params
		this.shouldRotateBrush = true;

		// TODO: implement
		this.shouldUsePenPressure = true;
				
		// prepare circle texture, that will be our brush
		this.brush = new PIXI.Graphics();
		this.updateBrush();
	}

	updateBrush({size, shape, color} = {}) {
		this.brushSize = size || this.brushSize;
		this.brushShape = shape || this.brushShape;
		this.color = color || this.color;
		this.brush.angle = 0;

		this.brush.clear();
		this.brush.beginFill(this.color);
		if (this.brushSize === 1) {
			this.brush.drawRect(0, 0, 1, 1);
		} else if (this.brushSize > 1 && this.brushShape === "round") {
			this.brush.drawCircle(0, 0, this.brushSize / 2);
		} else if (this.brushSize > 1 && this.brushShape === "flat") {
			this.brush.drawRect(-Math.ceil(this.brushSize/4), -Math.ceil(this.brushSize/2), this.brushSize/2, this.brushSize);
		} else {
			this.brush.drawRect(-Math.ceil(this.brushSize/2), -Math.ceil(this.brushSize/2), this.brushSize, this.brushSize);
		}
		this.brush.endFill();
	}

	begin(renderer, renderTexture, event, viewport) {
		this.move(renderer, renderTexture, event, viewport);
	}

	move(renderer, renderTexture, event, viewport) {
		this.brush.position.x = this.getX(event, viewport);
		this.brush.position.y = this.getY(event, viewport);
		
		let newPoint = new PIXI.Point(this.brush.position.x, this.brush.position.y);

		if (this.previousPoint) {
			if (this.shouldRotateBrush) {
				this.brush.angle = point_direction(this.previousPoint.x, this.previousPoint.y, newPoint.x, newPoint.y);
			}
			bresenham(this.previousPoint.x, this.previousPoint.y, newPoint.x, newPoint.y, (x, y) => {
				this.brush.position.x = x;
				this.brush.position.y = y;
				renderer.render(this.brush, renderTexture, false, null, false);
			});
		}

		this.previousPoint = newPoint;
	}

	end(renderer, renderTexture, event, viewport) {
		this.brush.position.x = this.getX(event, viewport);
		this.brush.position.y = this.getY(event, viewport);
		renderer.render(this.brush, renderTexture, false, null, false);
		this.previousPoint = null;
	}
}

export default Paint;