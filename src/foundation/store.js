class Store {
	constructor() {
		this.data = {};
		this.callbacks = {};
	}

	get(path) {
		const splitPath = path.split('.');
		let pointer = this.data;
		for (let i = 0; i < splitPath.length; i++) {
			const nextValue = splitPath[i];
			if (!pointer[nextValue]) {
				return undefined;
			}
			pointer = pointer[nextValue];
		}
		return pointer;
	}

	update(path, value) {
		const splitPath = path.split('.');
		let pointer = this.data;
		let pathToNow = '';
		for (let i = 0; i < splitPath.length - 1; i++) {
			const nextValue = splitPath[i];
			if (!pointer[nextValue]) {
				pointer[nextValue] = {};
			}
			// update all dependent paths
			pathToNow += '.' + nextValue;
			this._fire(pathToNow);
			pointer = pointer[nextValue];
		}
		pointer[splitPath[splitPath.length - 1]] = value;
		this._fire(path);
	}

	subscribe(path, callback) {
		if (!this.callbacks[path]) {
			this.callbacks[path] = [];
		}
		this.callbacks[path].push(callback);
	}

	_fire(path) {
		if (!this.callbacks[path]) {
			return;
		}

		for (const callback of this.callbacks[path]) {
			callback(this.get(path))
		}
	}
}

const storeSingleton = new Store();
Object.freeze(storeSingleton);

export default storeSingleton;