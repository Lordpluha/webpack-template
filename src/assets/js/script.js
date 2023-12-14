import { closePreloader } from './modules/design.js'
import testWebP from './modules/testWebp.js'
import beautyLoadInit from './modules/beauty_load.js'

document.addEventListener('DOMContentLoaded', () => {
	// Testing browser for supports webp
	testWebP(support => support
		? document.querySelector('body').classList.add('webp')
		: document.querySelector('body').classList.add('no-webp')
	)
})

window.onload = () => {
	// Preloader
	closePreloader()
	// Beauty load
	beautyLoadInit()
}