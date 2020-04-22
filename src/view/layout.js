import { html, render, useState } from '/node_modules/htm/preact/standalone.mjs';

const Layout = (props) => {
	return (html`
	<main id="app">
		<div id="header">

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