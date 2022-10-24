//panel
const panel = document.querySelector('.panel')
const inputCity = document.querySelector('.input-input')
const warning = document.querySelector('.panel__wrapper-error')
const searchBtn = document.querySelector('.input-btn')

//app dashboard
const appMain = document.querySelector('.app')
const cityName = document.querySelector('.app__top-city')
const photo = document.querySelector('.app__mid-img')
const backBtn = document.querySelector('.app__footer-back')
// units app
const descriptionValue = document.querySelector('.app__mid-container-description')
const feelValue = document.querySelector('.app__mid-container-text--feel')
const maxTempValue = document.querySelector('.app__mid-container-text--max')
const temperature = document.querySelector('.temperature')
const weather = document.querySelector('.weather')
const windValue = document.querySelector('.wind')
const pressureValue = document.querySelector('.pressure')
const humidityValue = document.querySelector('.humidity')

// gps btn
const localizationBtn = document.querySelectorAll('.localization-btn')

// settings
const settingsBtn = document.querySelector('.settings-btn')
const settingsDashboard = document.querySelector('.settings')
const settingsClose = document.querySelector('.settings__close')
// settings btn
const plInput = document.querySelectorAll('.pl-input')
const unitsBtn = document.querySelectorAll('.units-radio')

const API_LINK = 'https://api.openweathermap.org/data/2.5/weather?q='
const API_KEY = '&appid=a967b379e49952ca75115e9a5819ac5a'
let API_UNITS = '&units=metric'
const API_LANG = '&lang=en'
const API_LANG_PL = '&lang=pl'

let unicodeDegCel = '℃'
let unicodeMetSec = '㎧'

const getUrl = city => {
	const checkLang = localStorage.getItem('i18nextLng')
	let basicUrl = API_LINK + city + API_KEY + API_UNITS
	if (checkLang === 'pl') {
		return basicUrl + API_LANG_PL
	}
	return basicUrl + API_LANG
}
const checkUnits = () => {
	const localUnit = localStorage.getItem('units')

	if (localUnit === 'imperial') {
		API_UNITS = '&units=imperial'
		unicodeDegCel = '°F'
		unicodeMetSec = 'mph'
	} else {
		API_UNITS = '&units=metric'
		unicodeDegCel = '℃'
		unicodeMetSec = '㎧'
	}
}

const getWeather = (lang = API_LANG) => {
	let city = inputCity.value
	const URL = getUrl(city, lang)
	async function getAsyncWeather() {
		try {
			const res = await axios.get(URL)
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

			cityName.textContent = res.data.name
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
			console.log(res)
		} catch {
			warning.classList.add('show')
			checkInputValue()
		}
	}
	console.log(document.activeElement)
	document.activeElement.blur()
	getAsyncWeather()
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

		async function showCity() {
			try {
				const res = await axios.get(API_LAT_LONG)
				const villageSearch = res.data.address.village
				const citySearch = res.data.address.city
				const townSearch = res.data.address.town
				const hamletSearch = res.data.address.hamlet
				const suburbSearch = res.data.address.suburb

				arrayCity = [citySearch, townSearch, villageSearch, hamletSearch, suburbSearch]

				const foundCity = arrayCity.find(function (city) {
					return city != undefined
				})
				inputCity.value = foundCity
				cityName.textContent = foundCity
				getWeather()
				console.log(res)
			} catch {
				console.error(error)
			}
		}
		showCity()
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
		inputCity.placeholder = 'Podaj lokalizację....'
	} else {
		inputCity.placeholder = 'Enter your locations...'
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
	const checkLang = localStorage.getItem('i18nextLng')
	if (checkLang === 'pl') {
		warning.textContent = 'Wpisz prawidłowe miasto.'
	} else {
		warning.textContent = 'Please enter a valid city name.'
	}
}
const enterCheck = e => {
	if (e.key === 'Enter') {
		getWeather()
	}
}
unitsBtn.forEach(item => {
	item.addEventListener('change', () => {
		localStorage.setItem('units', item.value)
		checkUnits()
		getWeather()
	})
})

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

checkPlaceholderLang(inputCity)
checkUnits()
