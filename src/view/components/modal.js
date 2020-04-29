import { html, useState, useEffect } from '../../vendor/preact.js';
import store from '../../foundation/store.js';
export const Modal = (props) => {
	const [isVisible, setIsVisible] = useState(false);
	useEffect(() => {
		store.listen('modal_show', (id) => {
			if (id === props.id) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		})

		store.listen('modal_hide', () => {
			setIsVisible(false);
		})
	}, [])

	const onClickOverlay = () => {
		store.publish('modal_hide');
	}

	if (!isVisible) {
		return null;
	}

	return (html`<div onclick=${onClickOverlay} class="modal-overlay"></div>
	<div class="modal" id=${props.id}>
		${props.children}
	</div>`)
}
