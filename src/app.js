import { html, useEffect } from '/node_modules/htm/preact/standalone.mjs'

import store from './foundation/store.js';

import Layout from './view/layout.js';
import Artwork from './frame/artwork.js';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.RENDER_OPTIONS.antialias = false;
PIXI.settings.ROUND_PIXELS = true;
PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.OFF;

// setup brush tool

store.update('tool', 'PAINT');

store.subscribe('color', (color) => {
	paintTool.updateBrush({ color });
})

// temporary tool switching
document.addEventListener('keypress', (ev) => {
	if (store.get('tool') === 'PAINT') {
		store.update('tool', 'ERASER')
	} else if (store.get('tool') === 'ERASER') {
		store.update('tool', 'FILL')
	} else if (store.get('tool') == 'FILL') {
		store.update('tool', 'MOVE')
	} else {
		store.update('tool', 'PAINT')
	}
})


const App = (props) => {
	useEffect(() => {
		const artwork = new Artwork(document.getElementById("main"));
	}, [])
	return (html`<${Layout}>
	<//>`);
}

export default App;