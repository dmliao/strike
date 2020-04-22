import { html, render, useState, useEffect } from '/node_modules/htm/preact/standalone.mjs';
import store from '../foundation/store.js';
import { toolId } from '../frame/tools.js';

const ToolButton = (props) => {
	const tool = props.tool;
	const icon = props.icon;

	let [active, setActive] = useState(store.get('tool') === tool);

	useEffect(() => {
		store.subscribe('tool', (newTool) => {
			setActive(tool === newTool);
		});
	}, [])

	let buttonClass = 'tool-button'

	if (active) {
		buttonClass += ' active';
	}

	return (html`<button class=${buttonClass} onclick=${() => {
		store.update('tool', tool);
	}}><i class=${icon} /></button>`)
}

const Toolbox = (props) => {
	return (html`<nav>
		<${ToolButton} tool=${toolId.PAINT} icon="icon-round-brush" />
		<${ToolButton} tool=${toolId.ERASER} icon="icon-eraser" />
		<${ToolButton} tool=${toolId.FILL} icon="icon-bucket" />
	</nav>`)
}

export default Toolbox;