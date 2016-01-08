'use strict';

var i18n = require('i18n');
var path = require('path');

i18n.configure({
	// setup some locales - other locales default to en silently
	locales: ['en', 'ro', 'ru', 'hu', 'cs', 'bg', 'it', 'pl'],

	// where to store json files - defaults to './locales' relative to modules directory
	directory: path.join(__dirname, 'locales')

	//defaultLocale: config.language,

	// sets a custom cookie name to parse locale settings from  - defaults to NULL
	//cookie: 'lang',
});

module.exports = function(req, res, next) {
	var config = res.locals.config;
	var locale;
	var result = /^\/(ru)(\/|$)/i.exec(req.path);
	if (result && config.languages.indexOf(result[1].toLowerCase()) > -1) {
		locale = result[1].toLowerCase();
	} else {
		locale = config.language;
	}
	res.locals.locale = res.locale = locale;
	//i18n.setLocale(req, locale);
	i18n.init(req, res);
	res.setLocale(locale);

	return next();
};
