import { html } from '/node_modules/htm/preact/standalone.mjs';
import store from '../foundation/store.js';

import { ToolButton } from './components/tool_button.js'
import { DropdownButton, DropdownItem } from './components/dropdown.js';
import { toolId } from '../frame/tools.js'
import { Palette } from './palette.js'

import Toolbox from './header/toolbox.js'
import { ResizeModal, StretchModal } from './header/resize_modal.js'
import UndoRedo from './sidebar/undo_redo.js'
import BrushOptions from './sidebar/brush_options.js'

const Layout = (props) => {
	return (html`
	<main id="app">
		<div id="header">
			<${DropdownButton} label="File" hideOnLeave>
				<${DropdownItem} onclick=${() => { store.publish('new') }}>New Canvas<//>
				<${DropdownItem} onclick=${() => { store.publish('import') }}>Import Image<//>
				<${DropdownItem} onclick=${() => { store.publish('save') }}>Save Raw Image<//>
				<${DropdownItem} onclick=${() => { store.publish('export') }}>Export 1-bit Image<//>
			<//>
			<${DropdownButton} label="Image" hideOnLeave>
				<${DropdownItem} onclick=${() => { store.publish('modal_show', 'resize')}}>Resize Canvas<//>
				<${DropdownItem} onclick=${() => { store.publish('modal_show', 'stretch')}}>Stretch Image<//>
				<${DropdownItem} onclick=${() => { store.publish('mirror') }}>Mirror Horizontal<//>
				<${DropdownItem} onclick=${() => { store.publish('flip') }}>Flip Vertical<//>
			<//>
			<div class="header-right">
				<${Toolbox} />
				<${Palette} />
			</div>
			
		</div>
		<div id="sidebar">
			<${ToolButton} icon="icon-palette" tool=${toolId.EYEDROPPER} />
			<${BrushOptions} />
			<${UndoRedo} />
			<${ToolButton} icon="icon-move" tool=${toolId.MOVE} />
		</div>
		<div id="main">
			${props.children}
		</div>
		<${ResizeModal} />
		<${StretchModal} />
	</main>
	`);
}

export default Layout;