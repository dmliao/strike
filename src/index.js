import { html, render } from '/node_modules/htm/preact/standalone.mjs'

import App from './app.js';

render(html`<${App} />`, document.getElementById("ui"));