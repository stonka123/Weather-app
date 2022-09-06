const searchBtn = document.querySelector('.panel__wrapper-btn')
const backBtn = document.querySelector('.app__footer-back')
const panel = document.querySelector('.panel')
const cityName = document.querySelector('.app__top-city')
const appMain = document.querySelector('.app')
const photo = document.querySelector('.app__mid-img')
const inputCity = document.querySelector('.panel__wrapper-input')

const localizationBtn = document.querySelectorAll('.find-mee')
const temperature = document.querySelector('.temperature')
const weather = document.querySelector('.weather')
const windValue = document.querySelector('.wind')
const pressureValue = document.querySelector('.pressure')
const descriptionValue = document.querySelector('.app__mid-container-description')
const feelValue = document.querySelector('.app__mid-container-text--feel')
const maxTempValue = document.querySelector('.app__mid-container-text--max')

const humidityValue = document.querySelector('.humidity')
const warning = document.querySelector('.panel__wrapper-error')

// settings
const settingsBtn = document.querySelector('.settings-btn')
const settingsDashboard = document.querySelector('.settings')
const settingsClose = document.querySelector('.settings__close')

const plInput = document.querySelectorAll('.pl-input')

const API_LINK = 'https://api.openweathermap.org/data/2.5/weather?q='
const API_KEY = '&appid=a967b379e49952ca75115e9a5819ac5a'
const API_UNITS = '&units=metric'
const API_LANG = '&lang=en'
const API_LANG_PL = '&lang=pl'

const getUrl = city => {
	const checkLang = localStorage.getItem('i18nextLng')
	let basicUrl = API_LINK + city + API_KEY + API_UNITS
	if (checkLang === 'pl') {
		return basicUrl + API_LANG_PL
	}
	return basicUrl + API_LANG
}
const getWeather = (lang = API_LANG) => {
	let city = inputCity.value
	const URL = getUrl(city, lang)
	axios
		.get(URL)
		.then(res => {
			console.log(URL)
			warning.textContent = ''
			const weath = res.data.weather[0].main
			const desc = res.data.weather[0].description
			const feel = res.data.main.feels_like
			const maxTemp = res.data.main.temp_max
			const wind = res.data.wind.speed
			const temp = res.data.main.temp
			const hum = res.data.main.humidity
			const press = res.data.main.pressure
			const statusCode = res.data.weather[0].id

			let unicodeDegCel = '℃'
			let unicodeMetSec = '㎧'
			cityName.textContent = res.data.name
			// weather.textContent = desc
			temperature.textContent = Math.round(temp) + ' ' + unicodeDegCel
			feelValue.textContent = feel.toFixed(0) + '' + unicodeDegCel
			maxTempValue.textContent = maxTemp.toFixed(0) + '' + unicodeDegCel
			descriptionValue.textContent = desc
			windValue.textContent = wind.toFixed(1) + ' ' + unicodeMetSec
			humidityValue.textContent = hum + ' ' + '%'
			pressureValue.textContent = press + ' ' + '㍱'
			showApp()

			if (statusCode >= 200 && statusCode <= 232) {
				photo.setAttribute('src', './img/thunderstorm.png')
				weather.textContent = 'Burza'
			} else if (statusCode >= 300 && statusCode <= 532) {
				photo.setAttribute('src', './img/rainy.png')
				weather.textContent = 'Deszcz'
			} else if (statusCode >= 600 && statusCode <= 622) {
				photo.setAttribute('src', './img/snow.png')
				weather.textContent = 'Śnieg'
			} else if (statusCode >= 700 && statusCode <= 771) {
				photo.setAttribute('src', './img/weather-alert.png')
				weather.textContent = 'Niebezpiecznie'
			} else if (statusCode === 781) {
				photo.setAttribute('src', './img/tornado.png')
				weather.textContent = 'Silny wiatr'
			} else if (statusCode === 800) {
				photo.setAttribute('src', './img/sun.png')
				weather.textContent = 'Słonecznie'
			} else if (statusCode >= 801 && statusCode <= 804) {
				photo.setAttribute('src', './img/cloudy-day.png')
				weather.textContent = 'Zachmurzenie'
			}
			translateWeather(weather, statusCode, inputCity)
		})
		.catch(function () {
			checkInputValue()
			warning.classList.add('panel__wrapper-error--show')
		})
}

const translateWeather = (weather, statusCode) => {
	const checkLang = localStorage.getItem('i18nextLng')
	checkPlaceholderLang(inputCity)
	if (checkLang === 'en' && statusCode === 800) {
		weather.textContent = 'Sunny'
	} else if (checkLang === 'en' && statusCode >= 200 && statusCode <= 232) {
		weather.textContent = 'storm'
	} else if (checkLang === 'en' && statusCode >= 300 && statusCode <= 532) {
		weather.textContent = 'rain'
	} else if (checkLang === 'en' && statusCode >= 600 && statusCode <= 622) {
		weather.textContent = 'snow'
	} else if (checkLang === 'en' && statusCode >= 700 && statusCode <= 771) {
		weather.textContent = 'dangerous'
	} else if (checkLang === 'en' && statusCode === 781) {
		weather.textContent = 'strong wind'
	} else if (checkLang === 'en' && statusCode >= 801 && statusCode <= 804) {
		weather.textContent = 'cloudy'
	}
}


function geoFindMe() {
	function success(position) {
		const latitude = position.coords.latitude
		const longitude = position.coords.longitude
		const API_LAT_LONG = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
		axios
		.get(API_LAT_LONG)
		.then(res => {
			const villageSearch = res.data.address.village
				const citySearch = res.data.address.city
				const townSearch = res.data.address.town
				const hamletSearch = res.data.address.hamlet
				const suburbSearch = res.data.address.suburb
				
				tab = [citySearch, townSearch, villageSearch, hamletSearch, suburbSearch]
				const found = tab.find(function (el) {
					return el != undefined
				})
				inputCity.value = found
				cityName.textContent = found
				getWeather()
			})
			.catch(err => {
				console.log(err)
			})
		}
	function error() {
		alert('Unable to retrieve your location')
	}

	if (navigator.geolocation) {
		cityName.textContent = 'Locating…'
		console.log(navigator.geolocation)
		navigator.geolocation.getCurrentPosition(success, error, {
			maximumAge: 15000,
		})
	} else {
		alert('Geolocation is not supported by your browser')
	}
}

const checkPlaceholderLang = inputCity => {
	const checkLang = localStorage.getItem('i18nextLng')
	if (checkLang === 'pl') {
		inputCity.placeholder = 'Wpisz miasto'
	} else {
		inputCity.placeholder = 'Enter the city'
	}
}
const showApp = () => {
	panel.classList.add('translate-right')
	appMain.classList.add('show')
}

const showPanel = () => {
	panel.classList.remove('translate-right')
	appMain.classList.remove('show')
}

const closeSettings = () => {
	settingsDashboard.classList.remove('display-flex')
}

document.querySelector('.wrapper').addEventListener('click', e => {
	const closestSettingsBtn = e.target.closest('.settings-btn')
	
	if (closestSettingsBtn) {
		settingsDashboard.classList.toggle('display-flex')
	} else if (!closestSettingsBtn && settingsDashboard.classList.contains('display-flex')) {
		settingsDashboard.classList.remove('display-flex')
	}
})

const checkInputValue = () => {
	if (!inputCity.value) {
		warning.classList.add('show')
	}
}

checkPlaceholderLang(inputCity)





const enterCheck = e => {
	if (e.key === 'Enter') {
		getWeather()
	}
}
plInput.forEach(item => {
	item.addEventListener('change', () => {
		localStorage.setItem('i18nextLng', item.value)
		getWeather(item.value)
	})
})
searchBtn.addEventListener('click', getWeather)
backBtn.addEventListener('click', () => {
	setTimeout(showPanel, 50)
})
inputCity.addEventListener('keyup', enterCheck)
localizationBtn.forEach(el => {
	el.addEventListener('click', geoFindMe)
})
settingsClose.addEventListener('click', closeSettings)
