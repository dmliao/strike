import { html, useEffect } from './vendor/preact.js'

import store from './foundation/store.js';

import Layout from './view/layout.js';
import Artwork from './frame/artwork.js';
import Palette from './view/palette-pixi.js';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.RENDER_OPTIONS.antialias = false;
PIXI.settings.ROUND_PIXELS = true;
PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.OFF;

const setDocumentTitle = () => {
	const dim = store.get('dimensions');
	const isDirtyMarker = store.get('dirty') ? '*' : ''
	if (!dim) {
		document.title = "Strike";
		return;
	}
	document.title = "Strike | " + dim.width + "x" + dim.height + isDirtyMarker;
}

store.subscribe('dimensions', () => {
	setDocumentTitle();
});


store.subscribe('dirty', () => {
	setDocumentTitle();
});

// setup brush tool
store.update('eraser.size', 8);
store.update('tool', 'PAINT');
store.update('color', 0xffffff);

// load resources
PIXI.Loader.shared.add('shader', 'src/shaders/shader.frag')
.add('palette', 'src/palette/dither-palette.png')
.load((_loader, res) => {
	const texture = res.palette.texture;
	const uniforms = {
		palette: texture,
		swatchSize: 8
	}

	const shader = new PIXI.Filter('', res.shader.data, uniforms);
	store.update('resources', { shader });
});

const App = (props) => {
	useEffect(() => {
		const artwork = new Artwork(document.getElementById("main"));
		const palette = new Palette(document.getElementById("palette"));
			

	}, [])
	return (html`<${Layout}>
	<//>`);
}

export default App;