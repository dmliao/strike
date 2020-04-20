import { html, render, useState } from '/node_modules/htm/preact/standalone.mjs';

import store from '../foundation/store.js';
import { colors } from '../palette/raw_colors.js';

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
			style="border: 1px solid #000; width: 16px; height: 16px; display: inline-block; background-color: ${cssColor};" />
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

