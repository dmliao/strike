import { html, useState, useEffect } from '../vendor/preact.js';
import { Modal } from './components/modal.js';
import storeSingleton from '../foundation/store.js';

const NotSupportedComponent = (html`<blockquote><p><em>Strike doesn't have access to localStorage, so autosaving is not supported.</em></p></blockquote>`);
const SupportedComponent = (html`<blockquote><p>If autosaves are enabled, Strike will save the last edited canvas and load it when Strike is started up again. Creating a new canvas replaces the autosaved one.</p>
<p>Disabling autosave will clear the currently saved canvas.</p></blockquote>`);

const SettingsModal = (props) => {
	const [isChecked, setIsChecked] = useState(storeSingleton.get('autosave_enabled'));
	const [isAutosaveSupported, setIsAutosaveSupported] = useState(storeSingleton.get('can_autosave'));

	useEffect(() => {
		storeSingleton.subscribe('autosave_enabled', (isEnabled) => {
			setIsChecked(isEnabled);
		})

		storeSingleton.subscribe('can_autosave', (canAutosave) => {
			setIsAutosaveSupported(canAutosave);
		})
	}, [])

	const onCheckbox = () => {
		if (!isAutosaveSupported) {
			return;
		}
		const autosaveValue = document.getElementById('autosave-checkbox').checked;
		storeSingleton.update('autosave_enabled', autosaveValue);
	}

	return (html`<${Modal} id="settings">
		<h1>Settings</h1>
		<div class="setting">
			<input type="checkbox" disabled=${!isAutosaveSupported} onchange=${onCheckbox} id="autosave-checkbox" name="autosave"
			checked=${isChecked} />
			<label class="setting-label" for="autosave">Autosave</label>
		</div>
		${isAutosaveSupported ? SupportedComponent : NotSupportedComponent}
		<hr />
		<button onclick=${() => {
			storeSingleton.publish('modal_hide')
		}}>Close</button>
	<//>`)
}

export default SettingsModal