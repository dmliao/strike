import { html, useState, useEffect } from '/node_modules/htm/preact/standalone.mjs';
import store from '../../foundation/store.js';


export const IconButton = (props) => {
	let buttonClass = 'tool-button'

	if (props.active) {
		buttonClass += ' active';
	}
	if (props.disabled) {
		buttonClass += ' disabled';
	}

	return (html`<div><button title=${props.title} disabled=${props.disabled} class=${buttonClass} onclick=${props.onclick}><i class=${props.icon} /></button></div>`)
}

export const ToolButton = (props) => {
	const tool = props.tool;
	const icon = props.icon;

	let [active, setActive] = useState(store.get('tool') === tool);

	useEffect(() => {
		store.subscribe('tool', (newTool) => {
			setActive(tool === newTool);
		});
	}, [])

	return (html`<${IconButton} title=${props.title} active=${active} icon=${icon} onclick=${() => {
		store.update('tool', tool);
	}}/>`)
}
