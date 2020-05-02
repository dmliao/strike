import { colors } from '../palette/raw_colors.js'
import storeSingleton from '../foundation/store.js';

class Swatch {
	constructor(app, shader, index, color, width, height) {
		this.app = app;
		this.isSelected = undefined;
		
		this.swatchWidth = width;
		this.swatchHeight = height;
		this.color = color;
		this.swatch = new PIXI.Graphics();
		this.swatch.filters = [shader]

		this.updateSelected(this.color === storeSingleton.get('color'));

		this.swatch.position.x = index * this.swatchWidth + 1;
		this.swatch.interactive = true;
		this.swatch.on('pointerdown', () => {
			storeSingleton.update('color', this.color)
		})
		this._addSubscriptions();
	}

	_addSubscriptions() {
		storeSingleton.subscribe('color', (newColor) => {
			this.updateSelected(newColor === this.color)
		});
	}

	updateSelected(newIsSelected) {
		if (this.isSelected === newIsSelected) {
			return;
		}

		this.isSelected = newIsSelected;

		if (this.isSelected) {
			this.drawSelected();
		} else {
			this.drawUnselected();
		}
		this.app.ticker.update();
	}

	getGraphic() {
		return this.swatch;
	}

	drawUnselected() {
		this.swatch.clear();
		this.swatch.beginFill(this.color);
		this.swatch.lineStyle(1, 0xffffff);
		this.swatch.drawRect(0, 0, this.swatchWidth, this.swatchHeight);
		this.swatch.endFill();
	}

	drawSelected() {
		this.swatch.clear();
		this.swatch.beginFill(this.color);
		this.swatch.lineStyle(1, 0xffffff);
		this.swatch.drawRect(0, 0, this.swatchWidth, this.swatchHeight+8);
		this.swatch.endFill();
	}
}

class Palette {
	constructor(element) {
		this.swatchWidth = 20;
		this.swatchHeight = 32;
		this.selectedHeight = 40;
		this.app = new PIXI.Application({
			width: colors.length * this.swatchWidth + 2,
			height: this.selectedHeight,
			backgroundColor: 0x000000,
			autoStart: false
		});

		this.app.ticker.update();

		element.appendChild(this.app.view);

		storeSingleton.subscribe('resources', (res) => {
			this._onLoadResources(res);
		})
	}

	createSwatch(index, color) {
		const swatch = new Swatch(this.app, this.shader, index, color, this.swatchWidth, this.swatchHeight);
		this.app.stage.addChild(swatch.getGraphic())
		this.app.ticker.update();
	}

	_onLoadResources(res) {
		this.shader = res.shader;
		for (let i = 0; i < colors.length; i++ ) {
			this.createSwatch(i, colors[i])
		}
	}
}

export default Palette;