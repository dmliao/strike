import { html, useState, useEffect } from '/node_modules/htm/preact/standalone.mjs';

export const DropdownItem = (props) => {
	const noop = () => {}
	return (html`<li class="dropdown-item">
		<button class="dropdown-item-button" onclick=${props.onclick || noop}>
			${props.children}
		</button>
	</li>`)
}

export const DropdownButton = (props) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const onMouseEnter = () => {
		if (!props.showOnHover) {
			return;
		}
		setShowDropdown(true);
	}
	const onMouseLeave = () => {
		if (!props.hideOnLeave) {
			return;
		}
		setShowDropdown(false);
	}

	const onButtonClick = () => {
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