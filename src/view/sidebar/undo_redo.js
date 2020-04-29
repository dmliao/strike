import { html, render, useState, useEffect } from '../../vendor/preact.js';
import { IconButton } from '../components/tool_button.js';
import store from '../../foundation/store.js';

const UndoRedo = (props) => {
	let [canUndo, setCanUndo] = useState(store.get('can_undo'));
	let [canRedo, setCanRedo] = useState(store.get('can_redo'));

	useEffect(() => {
		store.subscribe('can_undo', (can) => {
			setCanUndo(can);
		})
		store.subscribe('can_redo', (can) => {
			setCanRedo(can);
		})
	}, []);

	return (html`<div>
		<${IconButton} disabled=${!canUndo} icon="icon-reply" onclick=${() => {
			store.publish('undo');
		}} />
		<${IconButton} disabled=${!canRedo} icon="icon-forward" onclick=${() => {
			store.publish('redo');
		}} />
	</div>`)
}

export default UndoRedo;