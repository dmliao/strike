import { html, useEffect } from '/src/vendor/preact.js'

import store from './foundation/store.js';

import Layout from './view/layout.js';
import Artwork from './frame/artwork.js';
import Palette from './view/palette-pixi.js';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.RENDER_OPTIONS.antialias = false;
PIXI.settings.ROUND_PIXELS = true;
PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.OFF;

// setup brush tool
store.update('eraser.size', 8);
store.update('tool', 'PAINT');
store.update('color', 0xffffff);

const App = (props) => {
	useEffect(() => {
		const artwork = new Artwork(document.getElementById("main"));
		const palette = new Palette(document.getElementById("palette"))
	}, [])
	return (html`<${Layout}>
	<//>`);
}

export default App;