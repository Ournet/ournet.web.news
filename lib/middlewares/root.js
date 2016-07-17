'use strict';

var utils = require('../utils');
var viewdata = require('../viewdata');

module.exports = function(req, res, next) {
	var config = res.locals.config;
	var culture = res.locals.currentCulture = {
		language: res.locale,
		lang: res.locale,
		country: config.country
	};
	culture.languageName = res.locals.__('language_' + culture.language);
	culture.countryName = res.locals.__('country_' + culture.country);

	res.locals.currentDate = utils.tz(config.timezone).toDate();

	res.viewdata = viewdata();

	res.locals.site = {
		name: config.name,
		head: {},
		platform: utils.getPlatform(req),
		locale: [culture.lang, culture.country.toUpperCase()].join('_')
	};

	res.locals.site.simpleLocale = res.locals.site.locale;

	if (culture.country === 'md') {
		if (culture.lang === 'ro') {
			res.locals.site.simpleLocale = 'ro_RO';
		} else if (culture.lang === 'ru') {
			res.locals.site.simpleLocale = 'ru_RU';
		}
	}

	next();
};
