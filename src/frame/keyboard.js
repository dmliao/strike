import store from '../foundation/store.js'

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
		'ctrl-y': () => {
			if (store.get('can_redo')) {
				store.publish('redo')
			}
		},
	}
	document.addEventListener('keydown', (e) => {
		let keySequence = ''

		// metakey to get mac os cmd to work
		// see https://stackoverflow.com/a/3922353
		if (e.ctrlKey || e.metaKey) {
			keySequence += 'ctrl-'
		}

		if (e.shiftKey) {
			keySequence += 'shift-'
		}

		if (e.key) {
			keySequence += e.key.toLowerCase()
		}

		if (shortcuts[keySequence]) {
			shortcuts[keySequence]()
		}
	})
}

export default setupKeyboardShortcuts
