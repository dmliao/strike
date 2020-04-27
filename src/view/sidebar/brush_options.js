import { html, render, useState, useEffect } from '/src/vendor/preact.js';
import store from '../../foundation/store.js';
import { toolId } from '../../frame/tools.js';

const BrushSizeSlider = () => {
	let [tool, setTool] = useState(store.get('tool'))
	let [size, setSize] = useState(1);

	useEffect(() => {
		store.subscribe('tool', (newTool) => {
			setTool(newTool);
			if (newTool === toolId.PAINT) {
				setSize(store.get('paint.size') || 1)
			} else if (newTool === toolId.ERASER) {
				setSize(store.get('eraser.size') || 1)
			}
		});
	}, [])
	
	return(html`<div id="brush-options"><div class="vertical-slider">
			<input type="range" title="Brush size" min="1" max="20" value=${size} class="range vertical" id="brush-size-slider" oninput=${(event) => {
				const newSize = document.getElementById("brush-size-slider").value
				if (tool === toolId.PAINT) {
					store.update('paint.size', newSize)
				} else if (tool === toolId.ERASER) {
					store.update('eraser.size', newSize)
				}
				setSize(newSize)
			}} />
		</div>
		<label>${size}</label>
		</div>`)
}

const BrushOptions = () => {
	let [tool, setTool] = useState(store.get('tool'))
	useEffect(() => {
		store.subscribe('tool', (newTool) => {
			setTool(newTool);
		});
	}, [])

	let view_style = '';
	if (tool !== toolId.PAINT && tool !== toolId.ERASER) {
		view_style = "visibility: hidden"
	}
	return (html`<div style=${view_style}>
		<${BrushSizeSlider} />
	</div>`)
}

export default BrushOptions;