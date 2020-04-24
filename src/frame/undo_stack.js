import store from '../foundation/store.js';

// TODO: undo / redo with the snapshot switchover is still questionable.

class UndoStack {
	constructor(artwork) {
		this.operationsPerSnapshot = 2;
		this.maxSnapshots = 5;

		/*
			each item in the snapshotStack is an obj of the form
			{
				texture: texture,
				index: number
			}
			where the index is the last index before the snapshot. So the snapshot with index -1 was created before any operations happened.
		*/
		this.snapshotStack = [];
		this.operationStack = [];
		this.currentOp = -1; // the last operation that is currently active on the canvas. Usually the last item in the operation stack.

		store.update('can_undo', this.canUndo());
		store.update('can_redo', this.canRedo());

		this.artwork = artwork;

		// listen to messages
		store.listen('undo', () => {
			this.undo(1);
			store.update('can_undo', this.canUndo());
			store.update('can_redo', this.canRedo());

		});
		store.listen('redo', () => {
			this.redo(1);
			store.update('can_undo', this.canUndo());
			store.update('can_redo', this.canRedo());
		})
	}

	reset() {
		this.snapshotStack = [];
		this.operationStack = [];

		this._addSnapshot();

		store.update('can_undo', this.canUndo());
		store.update('can_redo', this.canRedo());
	}

	_addSnapshot() {
		if (!this.artwork.renderTexture) {
			return;
		}
		
		if (this.snapshotStack.length && this.currentOp < this.operationStack.length) {
			// remove everything on the redo stack. This means clobbering any snapshots whose
			// indexes are past the currentOp index.
			let cutOffpoint = this.snapshotStack.length;
			for (let i = 0; i < this.snapshotStack.length; i++) {
				const snapshot = this.snapshotStack[this.snapshotStack.length - 1 - i];
				if (snapshot.index <= this.currentOp) {
					break;
				}
				cutOffpoint = i;
			}

			this.snapshotStack = this.snapshotStack.slice(0, cutOffpoint);
		}
		
		const snapshotTexture = PIXI.RenderTexture.create(this.artwork.renderTexture.width, this.artwork.renderTexture.height);
		const existingSprite = new PIXI.Sprite(this.artwork.renderTexture);
		this.artwork.app.renderer.render(existingSprite, snapshotTexture, true, null, false);
		this.snapshotStack.push({
			// TODO: we need to do a better job of this.
			texture: snapshotTexture,
			index: this.currentOp,
		});
	}

	addUndoable(toolName, operation, createSnapshot) {

		const lastOperationWithSnapshot = this.snapshotStack[this.snapshotStack.length - 1].index;
		if (lastOperationWithSnapshot + this.operationsPerSnapshot < this.currentOp) {
			createSnapshot = true;
		}
		
		if (createSnapshot) {
			this._addSnapshot();
		}

		// clobber the redo stack.
		this.operationStack = this.operationStack.slice(0, this.currentOp + 1);

		this.operationStack.push({
			toolName,
			operation
		});

		this.currentOp = this.operationStack.length - 1;

		store.update('can_undo', this.canUndo());
		store.update('can_redo', this.canRedo());

		console.log(this.snapshotStack);
		console.log(this.operationStack);
		console.log(this.currentOp);
	}

	undo(steps) {
		steps = steps || 1;
		if (!this.canUndo()) {
			// nothing to undo.
			return;
		}
		
		let targetOp = this.currentOp - steps;
		if (targetOp < -1) {
			targetOp = -1;
		}
		let targetSnapshot = this._getClosestSnapshot(targetOp);

		// reset artwork buffer to snapshot
		this.artwork.setToSnapshot(targetSnapshot.texture);

		// apply operations on the snapshot until you get to the targetOp.
		for (let op = targetSnapshot.index + 1; op <= targetOp; op++) {
			this.artwork.applySavedOperation(this.operationStack[op]);
		}

		this.currentOp = targetOp;
	}

	canUndo() {
		return this.currentOp >= 0;
	}

	canRedo() {
		return this.currentOp < this.operationStack.length - 1;
	}

	redo(steps) {
		steps = steps || 1;

		if (!this.canRedo()) {
			return;
		}
		
		let targetOp = this.currentOp + steps;
		if (targetOp > this.operationStack.length - 1) {
			targetOp = this.operationStack.length - 1;
		}

		let targetSnapshot = this._getClosestSnapshot(targetOp);

		for (let op = targetSnapshot.index + 1; op <= targetOp; op ++) {
			this.artwork.applySavedOperation(this.operationStack[op]);
		}

		this.currentOp = targetOp;
	}

	_getClosestSnapshot(targetIndex) {
		console.log('target index is ', targetIndex)
		// get the snapshot closest to currentOp
		for (let i = 0; i < this.snapshotStack.length; i++) {
			const snapshot = this.snapshotStack[this.snapshotStack.length - 1 - i];
			
			console.log('examining snapshot', snapshot);
			if (snapshot.index <= targetIndex) {
				return snapshot;
			}
		}
	}
}

export default UndoStack;