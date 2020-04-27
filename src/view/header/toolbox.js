import { html, render, useState, useEffect } from '/src/vendor/preact.js';
import { toolId } from '../../frame/tools.js';
import { ToolButton } from '../components/tool_button.js';

const Toolbox = (props) => {
	return (html`<nav id="toolbox">
		<${ToolButton} title="Brush tool" tool=${toolId.PAINT} icon="icon-round-brush" />
		<${ToolButton} title="Eraser tool" tool=${toolId.ERASER} icon="icon-eraser" />
		<${ToolButton} title="Fill tool" tool=${toolId.FILL} icon="icon-bucket" />
	</nav>`)
}

export default Toolbox;