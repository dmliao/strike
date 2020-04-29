import { html, render, useState } from '../vendor/preact.js';

import store from '../foundation/store.js';
import { colors } from '../palette/raw_colors.js';

// NOTE: this is unused. We switched over to palette-pixi. 
// switch over swatch and palette to be a pixi app, where
// the swatches are https://pixijs.download/dev/docs/PIXI.TilingSprite.html instances and 
// the textures are cut from the palette via http://pixijs.download/dev/docs/PIXI.Texture.html's frame
// we can make it interactive via https://pixijs.io/examples/#/interaction/click.js
const Swatch = (props) => {
	const [isActive, setIsActive] = useState(store.get('color') === props.color);

	const clickHandler = (evt) => {
		store.update('color', props.color);
	}

	const onSubscribe = (color) => {
		setIsActive(color === props.color);
	}

	store.subscribe('color', onSubscribe);

	const cssColor = '#' + props.color.toString(16).padStart(6, '0');
	if (isActive) {
		return (html`
		<span onclick=${clickHandler} 
			style="border: 1px solid #000; width: 16px; height: 24px; display: inline-block; background-color: ${cssColor};" />
	`);
	}
	return (html`
		<span onclick=${clickHandler} 
			style="border: 1px solid rgba(0,0,0,0); width: 16px; height: 16px; display: inline-block; background-color: ${cssColor};" />
	`);
}

export const Palette = (props) =>{
	return (html`<div>
		${colors.map( color => {
			return (html`<${Swatch} color=${color}/>`);
		})}
	</div>`);
}

