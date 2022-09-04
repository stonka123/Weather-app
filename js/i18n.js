const lngs = {
	en: { nativeName: 'English' },
	pl: { nativeName: 'Polski' },
}

const rerender = () => {
	// start localizing, details:
	// https://github.com/i18next/jquery-i18next#usage-of-selector-function
	$('body').localize()
}

$(function () {
	// use plugins and options as needed, for options, detail see
	// https://www.i18next.com
	i18next
		// detect user language
		// learn more: https://github.com/i18next/i18next-browser-languageDetector
		.use(i18nextBrowserLanguageDetector)
		// init i18next
		// for all options read: https://www.i18next.com/overview/configuration-options
		.init(
			{
				debug: true,
				fallbackLng: 'en',
				resources: {
					en: {
						translation: {
							panel: {
								header: 'Weather App',
								searchBtn: 'Search',
								localizeBtn: 'Find Me',
								placeholder: 'Enter the city',
								error: 'Please enter a valid city name',
							},
							app: {
								weather: 'weather:',
								wind: 'wind:',
								humidity: 'humidity:',
								pressure: 'pressure:',
								back: 'back',
							},
						},
					},
					pl: {
						translation: {
							panel: {
								header: 'Aplikacja Pogodowa',
								searchBtn: 'Szukaj',
								localizeBtn: 'Znajdź mnie',
								placeholder: 'Wprowadź miasto',
								error: 'Wpisz prawidłowe miasto.',
							},
							app: {
								weather: 'pogoda:',
								wind: 'wiatr:',
								humidity: 'wilogtość:',
								pressure: 'ciśnienie:',
								back: 'wróć',
							},
						},
					},
				},
			},
			(err, t) => {
				if (err) return console.error(err)

				// for options see
				// https://github.com/i18next/jquery-i18next#initialize-the-plugin
				jqueryI18next.init(i18next, $, { useOptionsAttr: true })

				// fill language switcher
				Object.keys(lngs).map(lng => {
					const opt = new Option(lngs[lng].nativeName, lng)
					if (lng === i18next.resolvedLanguage) {
						opt.setAttribute('selected', 'selected')
					}
					$('.languageSwitcher').append(opt)
				})
				$('.languageSwitcher').change((a, b, c) => {
					const chosenLng = $(this).find('input:checked').attr('value')
					i18next.changeLanguage(chosenLng, () => {
						rerender()
					})
				})

				rerender()
			}
		)
})