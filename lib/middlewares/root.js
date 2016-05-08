'use strict';

var utils = require('../utils');

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

	res.locals.site = {
		name: config.name,
		head: {},
		platform: utils.getPlatform(req)
	};

	next();
};
