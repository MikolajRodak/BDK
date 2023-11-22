const nav = document.querySelector('.nav')
const navBtn = document.querySelector('.burger-btn')
const navItems = document.querySelector('.nav__hidden-menu')
const navBtnBars = document.querySelector('.burger-btn__bars')

navBtn.addEventListener('click', () => {
	navBtn.classList.toggle('is-active')
	if (navItems.classList.contains('hidden-navigation')) {
		navItems.classList.remove('hidden-navigation')
	} else {
		navItems.classList.add('hidden-navigation')
	}
})
