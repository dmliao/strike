import storeSingleton from "../foundation/store.js";

class Autosave {
	constructor(artwork) {
		this.settingName = 'setting_autosave_enabled';
		this._initializeSetting();

		this.artwork = artwork;
		this.filename = 'autosave';
		this.enabled = storeSingleton.get('autosave_enabled');

		storeSingleton.subscribe('autosave_enabled', (val) => {
			this.enabled = val;
			window.localStorage.setItem(this.settingName, val ? 'true' : 'false')
			if (!this.enabled) {
				console.log('autosaves disabled; clearing current autosave.')
				this.clear();
			} else {
				console.log('enabling autosaves. creating an autosave now...')
				this.save();
			}
		});

		const self = this;
			
		window.addEventListener('beforeunload', (e) => {
			const isDirty = storeSingleton.get('dirty');
			if (!isDirty) {
				return;
			}

			// if we have autosave enabled, we don't really have to worry about this
			if (self.enabled) {
				return;
			}

			const confirmExit = 'Exit without saving?';
			(e || window.event).returnValue = confirmExit;
			return confirmExit;
		});
	}

	_initializeSetting() {
				
		// load settings
		let autosaveSetting = window.localStorage.getItem(this.settingName);
		if (autosaveSetting === null) {
			autosaveSetting = 'true'; // true is default
		}

		storeSingleton.update('autosave_enabled', autosaveSetting === 'true' ? true : false);

	}

	isEnabled() {
		return this.enabled;
	}

	clear() {
		if (!this.enabled) {
			return;
		}
		window.localStorage.removeItem(this.filename);
	}

	load() {
		if (!this.enabled) {
			return undefined;
		}
		try {
			const data = window.localStorage.getItem(this.filename);
			if (!data || !data.length) {
				return undefined;
			}

			return data;
		} catch (e) {
			console.log(e);
			return undefined;
		}
	}

	save() {
		if (!this.enabled) {
			return;
		}
		// oh well, this is kind of spaghetti-ing a bit
		const canvas = this.artwork.getCanvas();
		const data = canvas.toDataURL();
		try {
			window.localStorage.setItem(this.filename, data);
		} catch (e) {
			console.log(e);
		}
	}
}

export default Autosave;