import { html, render } from '/src/vendor/preact.js'

import App from './app.js';

render(html`<${App} />`, document.getElementById("ui"));