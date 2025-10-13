const dispatch = (title, message, color, duration) => {
	const ev = new CustomEvent('spde:toast', { detail: { title, message, color, duration } })
	window.dispatchEvent(ev)
}

export const success = (msg, title = 'Éxito') => dispatch(title, msg, '#2f855a', 2500)
export const error = (msg, title = 'Error') => dispatch(title, msg, '#e53e3e', 4000)
export const info = (msg, title = 'Info') => dispatch(title, msg, '#2b6cb0', 3000)