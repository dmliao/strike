import { html, render, useState } from '/node_modules/htm/preact/standalone.mjs';

import { ToolButton } from './components/tool_button.js'
import { toolId } from '../frame/tools.js'

import Toolbox from './header/toolbox.js'
import UndoRedo from './sidebar/undo_redo.js'
import BrushOptions from './sidebar/brush_options.js'

const Layout = (props) => {
	return (html`
	<main id="app">
		<div id="header">
			<${Toolbox} />
		</div>
		<div id="sidebar">
			<${BrushOptions} />
			<${UndoRedo} />
			<${ToolButton} icon="icon-move" tool=${toolId.MOVE} />
		</div>
		<div id="main">
			${props.children}
		</div>
	</main>
	`);
}

export default Layout;