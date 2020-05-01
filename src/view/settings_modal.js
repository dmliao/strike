import { html, useState, useEffect } from '../vendor/preact.js';
import { Modal } from './components/modal.js';
import storeSingleton from '../foundation/store.js';

const SettingsModal = (props) => {
	const [isChecked, setIsChecked] = useState(storeSingleton.get('autosave_enabled'));

	useEffect(() => {
		storeSingleton.subscribe('autosave_enabled', (isEnabled) => {
			setIsChecked(isEnabled);
		})
	}, [])

	const onCheckbox = () => {
		const autosaveValue = document.getElementById('autosave-checkbox').checked;
		storeSingleton.update('autosave_enabled', autosaveValue);
	}

	return (html`<${Modal} id="settings">
		<h1>Settings</h1>
		<div class="setting">
			<input type="checkbox" onchange=${onCheckbox} id="autosave-checkbox" name="autosave"
			checked=${isChecked} />
			<label class="setting-label" for="autosave">Autosave</label>
		 </div>
		 <blockquote>
			<p>If autosaves are enabled, Strike will save the last edited canvas and load it when Strike is started up again. Creating a new canvas replaces the autosaved one.</p>
			<p>Disabling autosave will clear the currently saved canvas.</p>
		 </blockquote>
		<hr />
		<button onclick=${() => {
			storeSingleton.publish('modal_hide')
		}}>Close</button>
	<//>`)
}

export default SettingsModal