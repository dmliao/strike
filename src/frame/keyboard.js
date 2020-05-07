import store from "../foundation/store.js"

const setupKeyboardShortcuts = () => {
	const shortcuts = {
		'ctrl-z': () => { 
			if (store.get('can_undo')) {
				store.publish('undo')
			}
		},
		'ctrl-shift-z': () => {
			if (store.get('can_redo')) {
				store.publish('redo')
			}
		},
	}
	document.addEventListener('keydown', (e) => {
		let keySequence = '';
		if (e.ctrlKey) {
			keySequence += 'ctrl-'
		}

		if (e.shiftKey) {
			keySequence += 'shift-'
		}

		if (e.key) {
			keySequence += e.key.toLowerCase();
		}
		
		if (shortcuts[keySequence]) {
			shortcuts[keySequence]();
		}
	});
}

export default setupKeyboardShortcuts;