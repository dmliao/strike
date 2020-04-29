import { html, useState, useEffect } from '../../vendor/preact.js';
import { Modal } from '../components/modal.js';
import storeSingleton from '../../foundation/store.js';

export const ResizeModal = (props) => {

	const [w, setWidth] = useState(storeSingleton.get('dimensions.width'));
	const [h, setHeight] = useState(storeSingleton.get('dimensions.height'));

	useEffect(() => {
		storeSingleton.subscribe('dimensions', (dim) => {
			setWidth(dim.width)
			setHeight(dim.height)
		})
	}, [])

	const onclick = () => {
		const dimensions = {
			width: document.getElementById('resize_w').value || 800,
			height: document.getElementById('resize_h').value || 600
		}
		storeSingleton.publish('resize', dimensions);

		storeSingleton.publish('modal_hide')
		storeSingleton.publish('center')
	}

	return (html`<${Modal} id="resize">
	<h1>Resize Canvas</h1>
	<hr />
	<div>
		<label>Width</label>
		<input id="resize_w" type="number" min="1" value=${w} /> 
	</div>
	<div>
		<label>Height</label>
		<input id="resize_h" type="number" min="1" value=${h} /> 
	</div>
	<p>All resizes assume that the origin / scale point is at the top left corner of the image. Sorry, there's no way to change that right now.</p>
	<hr />
	<div>
		<button onclick=${onclick}>Confirm</button>
		<button onclick=${() => {
			storeSingleton.publish('modal_hide')
		}}>Cancel</button>
	</div>
	<//>`)
}


export const StretchModal = (props) => {

	const [w, setWidth] = useState(storeSingleton.get('dimensions.width'));
	const [h, setHeight] = useState(storeSingleton.get('dimensions.height'));

	useEffect(() => {
		storeSingleton.subscribe('dimensions', (dim) => {
			setWidth(dim.width)
			setHeight(dim.height)
		})
	}, [])

	const onclick = () => {
		const dimensions = {
			width: document.getElementById('stretch_w').value || 800,
			height: document.getElementById('stretch_h').value || 600
		}
		storeSingleton.publish('stretch', dimensions);

		storeSingleton.publish('modal_hide')
		storeSingleton.publish('center')
	}

	return (html`<${Modal} id="stretch">
	<h1>Stretch Canvas</h1>
	<hr />
	<div>
		<label>Width</label>
		<input id="stretch_w" type="number" min="1" value=${w} /> 
	</div>
	<div>
		<label>Height</label>
		<input id="stretch_h" type="number" min="1" value=${h} /> 
	</div>
	<hr />
	<div>
		<button onclick=${onclick}>Confirm</button>
		<button onclick=${() => {
			storeSingleton.publish('modal_hide')
		}}>Cancel</button>
	</div>
	<//>`)
}
