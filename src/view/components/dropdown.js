import { html, useState, useEffect } from '/src/vendor/preact.js';
import store from '../../foundation/store.js';

export const DropdownItem = (props) => {
	const onclick = () => {
		if (props.onclick) {
			props.onclick();
		}

		store.publish('hide_dropdown')
	}
	return (html`<li class="dropdown-item">
		<button title=${props.title} class="dropdown-item-button" onclick=${onclick}>
			${props.children}
		</button>
	</li>`)
}

export const DropdownButton = (props) => {
	useEffect(() => {
		store.listen('hide_dropdown', () => {
			setShowDropdown(false)
		});
	}, [])
	const [showDropdown, setShowDropdown] = useState(false);
	const onMouseEnter = () => {
		if (!props.showOnHover) {
			return;
		}
		store.publish('hide_dropdown')
		setShowDropdown(true);
	}
	const onMouseLeave = () => {
		if (!props.hideOnLeave) {
			return;
		}
		setShowDropdown(false);
	}

	const onButtonClick = () => {
		if (!showDropdown) {
			store.publish('hide_dropdown');
		}
		setShowDropdown(!showDropdown);
	}

	let style = '';
	if (!showDropdown) {
		style = "display: none"
	}
	
	return (html`<div class="dropdown">
		<button class="dropdown-button" onmouseenter=${onMouseEnter} onclick=${onButtonClick}>${props.label || 'UNLABLED'}</button>
		<ul class="dropdown-list" style=${style} onmouseleave=${onMouseLeave}>
			${props.children}
		</ul>
	</div>`)
}