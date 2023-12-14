export const closePreloader = () => {
	document.querySelector('.preloader').classList.add('loaded')
	document.querySelector('body').classList.remove('lock')
}	