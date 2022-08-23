const searchBtn = document.querySelector('.panel__wrapper-btn')
const backBtn = document.querySelector('.app__footer-back')
const panel = document.querySelector('.panel')
const appMain = document.querySelector('.app')

const showApp = () => {
	panel.classList.add('translate-right')
	appMain.classList.add('show')
}

const showPanel = () => {
	panel.classList.remove('translate-right')
	appMain.classList.remove('show')
}

searchBtn.addEventListener('click', showApp)
backBtn.addEventListener('click', showPanel)
