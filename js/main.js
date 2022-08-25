const searchBtn = document.querySelector('.panel__wrapper-btn')
const backBtn = document.querySelector('.app__footer-back')
const panel = document.querySelector('.panel')
const cityName = document.querySelector('.app__top-city')
const appMain = document.querySelector('.app')
const inputCity = document.querySelector('.panel__wrapper-input')
const temperature = document.querySelector('.temperature')
const weather = document.querySelector('.weather')
const windValue = document.querySelector('.wind')
const pressureValue = document.querySelector('.pressure')
const descriptionValue = document.querySelector('.app__mid-container-description')
const feelValue = document.querySelector('.app__mid-container-text--feel')
const maxTempValue = document.querySelector('.app__mid-container-text--max')

const humidityValue = document.querySelector('.humidity')
const warning = document.querySelector('.panel__wrapper-error')

const API_LINK = 'https://api.openweathermap.org/data/2.5/weather?q='
const API_KEY = '&appid=a967b379e49952ca75115e9a5819ac5a'
const API_UNITS = '&units=metric'
const API_LANG = '&lang=pl'

const getWeather = () => {
	const city = inputCity.value
	const URL = API_LINK + city + API_KEY + API_UNITS + API_LANG

	axios
		.get(URL)
		.then(res => {
			console.log(res)
			warning.textContent = ''
			const weath = res.data.weather[0].main
			const desc = res.data.weather[0].description
			const feel = res.data.main.feels_like
			const maxTemp = res.data.main.temp_max
			const wind = res.data.wind.speed
			const temp = res.data.main.temp
			const hum = res.data.main.humidity
			const press = res.data.main.pressure

			let unicodeDegCel = '℃'
			let unicodeMetSec = '㎧'
			cityName.textContent = res.data.name
			temperature.textContent = Math.round(temp) + ' ' + unicodeDegCel
			feelValue.textContent = feel.toFixed(0) + '' + unicodeDegCel
			maxTempValue.textContent = maxTemp.toFixed(0) + '' + unicodeDegCel
			descriptionValue.textContent = desc
			windValue.textContent = wind.toFixed(1) + ' ' + unicodeMetSec
			humidityValue.textContent = hum + ' ' + '%'
			pressureValue.textContent = press + ' ' + '㍱'
			showApp()
		})
		.catch(() => {
			warning.textContent = 'Please enter a valid city name'
			warning.classList.add('show')
		})
}

const showApp = () => {
	panel.classList.add('translate-right')
	appMain.classList.add('show')
}

const showPanel = () => {
	panel.classList.remove('translate-right')
	appMain.classList.remove('show')
}

const enterCheck = e => {
	if (e.key === 'Enter') {
		getWeather()
	}
}

searchBtn.addEventListener('click', () => {
	setTimeout(getWeather, 50)
})
backBtn.addEventListener('click', () => {
	setTimeout(showPanel, 50)
})

inputCity.addEventListener('keyup', enterCheck)