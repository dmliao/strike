import { html } from '../vendor/preact.js';
import store from '../foundation/store.js';

import { ToolButton, IconButton } from './components/tool_button.js'
import { DropdownButton, DropdownItem } from './components/dropdown.js';
import { toolId } from '../frame/tools.js'

import BrushShapes from './header/brush_shapes.js'
import Toolbox from './header/toolbox.js'
import { ResizeModal, StretchModal } from './header/resize_modal.js'
import UndoRedo from './sidebar/undo_redo.js'
import BrushOptions from './sidebar/brush_options.js'
import AboutModal from './about_modal.js';
import SettingsModal from './settings_modal.js';

const Layout = (props) => {
	return (html`
	<main id="app">
		<div id="header">
			<${DropdownButton} label="File" hideOnLeave>
				<${DropdownItem} onclick=${() => { store.publish('new') }}>New Canvas<//>
				<${DropdownItem} onclick=${() => { store.publish('new_fit') }}>New (Fit to screen)<//>
				<${DropdownItem} onclick=${() => { store.publish('import') }}>Import Image<//>
				<${DropdownItem} title="Saves canvas as a 16-color greyscale image, such that when the image is imported back into this tool, the dithers will render as you created them." onclick=${() => { store.publish('save') }}>Save Raw Image<//>
				<${DropdownItem} title="Saves canvas as a 1-bit black and white image for exporting." onclick=${() => { store.publish('export') }}>Export 1-bit Image<//>
			<//>
			<${DropdownButton} label="Image" hideOnLeave>
				<${DropdownItem} onclick=${() => { store.publish('modal_show', 'resize')}}>Resize Canvas<//>
				<${DropdownItem} onclick=${() => { store.publish('modal_show', 'stretch')}}>Stretch Image<//>
				<${DropdownItem} onclick=${() => { store.publish('mirror') }}>Mirror Horizontal<//>
				<${DropdownItem} onclick=${() => { store.publish('flip') }}>Flip Vertical<//>
			<//>
			<div class="header-right">
				<${BrushShapes} />
				<div class="h-gap" />
				<${Toolbox} />
				<div id="palette" />
			</div>
			
		</div>
		<div id="sidebar">
			<div class="sidebar-top" />
			<div class="sidebar-middle">
			<${ToolButton} title="Sample color" icon="icon-palette" tool=${toolId.EYEDROPPER} />
			
			<${BrushOptions} />
			<${UndoRedo} />
			<${ToolButton} title="Move view" icon="icon-move" tool=${toolId.MOVE} />
			<${IconButton} title="Recenter view" icon="icon-hair-cross" onclick=${() => {
				store.publish('center')
			}} />
			</div>
			<div class="sidebar-bottom">
			<${IconButton} title="Settings" icon="icon-cog" onclick=${() => { store.publish('modal_show', 'settings')}} />
			<${IconButton} title="About" icon="icon-help" onclick=${() => { store.publish('modal_show', 'about')}} />
			</div>
		</div>
		<div id="main">
			${props.children}
		</div>
		<${ResizeModal} />
		<${StretchModal} />
		<${AboutModal} />
		<${SettingsModal} />
	</main>
	`);
}

export default Layout;