import { html, render, useState, useEffect } from '/src/vendor/preact.js';
import store from '../../foundation/store.js';
import { toolId } from '../../frame/tools.js';
import { IconButton } from '../components/tool_button.js';

const BrushShapeButton = (props) => {
	let [tool, setTool] = useState(store.get('tool'))
	let [isActive, setIsActive] = useState(store.get('paint.shape') === props.shape);

	useEffect(() => {
		store.subscribe('tool', (newTool) => {
			setTool(newTool);
			tool = newTool // I'm not sure why this is needed but it is
			if (newTool === toolId.PAINT) {
				setIsActive(store.get('paint.shape')  === props.shape)
			} else if (newTool === toolId.ERASER) {
				setIsActive(store.get('eraser.shape') === props.shape)
			}
		});

		store.subscribe('paint.shape', (shape) => {
			if (tool !== toolId.PAINT) {
				return;
			}
			setIsActive(shape === props.shape)
		});

		store.subscribe('eraser.shape', (shape) => {
			if (tool !== toolId.ERASER) {
				return;
			}
			setIsActive(shape === props.shape)
		});
	}, [])

	const clickHandler = () => {
		if (tool === toolId.PAINT) {
			store.update('paint.shape', props.shape)
		} else if (tool === toolId.ERASER) {
			store.update('eraser.shape', props.shape)
		}
	}

	let view_style = '';
	if (tool !== toolId.PAINT && tool !== toolId.ERASER) {
		view_style = "visibility: hidden"
	}

	return (html`<${IconButton} style=${view_style} active=${isActive} icon=${props.icon} title=${props.title} onclick=${clickHandler}/>`)
	
}

const BrushShapes = (props) => {
	
	return (html`<nav id="shapes">
		<${BrushShapeButton} shape="round" title="Brush shape: Circle" icon="icon-circle" />
		<${BrushShapeButton} shape="square" title="Brush shape: Square" icon="icon-square" />
		<${BrushShapeButton} shape="flat" title="Brush shape: Flat" icon="icon-document" />
	</nav>`)
}

export default BrushShapes;