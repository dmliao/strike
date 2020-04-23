import { html, render, useState, useEffect } from '/node_modules/htm/preact/standalone.mjs';
import { toolId } from '../../frame/tools.js';
import { ToolButton } from '../components/tool_button.js';

const Toolbox = (props) => {
	return (html`<nav>
		<${ToolButton} tool=${toolId.PAINT} icon="icon-round-brush" />
		<${ToolButton} tool=${toolId.ERASER} icon="icon-eraser" />
		<${ToolButton} tool=${toolId.FILL} icon="icon-bucket" />
	</nav>`)
}

export default Toolbox;