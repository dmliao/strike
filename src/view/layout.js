import { html, render, useState } from '/node_modules/htm/preact/standalone.mjs';

import Toolbox from './toolbox.js'

const Layout = (props) => {
	return (html`
	<main id="app">
		<div id="header">
			<${Toolbox} />
		</div>
		<div id="sidebar">

		</div>
		<div id="main">
			${props.children}
		</div>
	</main>
	`);
}

export default Layout;