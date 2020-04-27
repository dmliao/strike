import { html, useState, useEffect } from '/src/vendor/preact.js';
import { Modal } from './components/modal.js';
import storeSingleton from '../foundation/store.js';

const AboutModal = (props) => {
	return (html`<${Modal} id="about">
		<h1>Strike <small>v0.1.0</small></h1>
		<p>a 1-bit painting app</p>
		<p>written by <a href="https://amorphic.space">Amorphous</a></p>
		<hr />
		<p>Icons: <a href="https://feathericons.com/">Feather</a> by Cole Bemis and <a href="http://www.entypo.com/">Entypo</a> by Daniel Bruce</p>
		<hr />
		<button onclick=${() => {
			storeSingleton.publish('modal_hide')
		}}>Close</button>
	<//>`)
}

export default AboutModal