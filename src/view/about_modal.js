import { html, useState, useEffect } from '../vendor/preact.js';
import { Modal } from './components/modal.js';
import storeSingleton from '../foundation/store.js';

const AboutModal = (props) => {
	return (html`<${Modal} id="about">
		<h1>Strike <small>v0.1.0</small></h1>
		<p>a 1-bit painting app</p>
		<p>written by <a href="https://amorphic.space">Amorphous</a></p>
		<hr />
		<h1>Usage Notes:</h1>
		<ul>
			<li>You can use two finger pinch or mouse wheel / scroll to zoom the canvas in and out.</li>
			<li>Undo and Redo are still pretty flaky. Use at your own risk. There is currently a 50 action hard undo-limit, but because of the inconsistent cleanup you might not have 50 undo states available.</li>
		</ul>
		<hr />
		<p>Icons: <a href="https://feathericons.com/">Feather</a> by Cole Bemis and <a href="http://www.entypo.com/">Entypo</a> by Daniel Bruce</p>
		<hr />
		<button onclick=${() => {
			storeSingleton.publish('modal_hide')
		}}>Close</button>
	<//>`)
}

export default AboutModal