import { html, render, useState, useEffect } from '/node_modules/htm/preact/standalone.mjs';
import { IconButton } from '../components/tool_button.js';

const UndoRedo = (props) => {
	return (html`<div>
		<${IconButton} icon="icon-reply" />
		<${IconButton} icon="icon-forward" />
	</div>`)
}

export default UndoRedo;