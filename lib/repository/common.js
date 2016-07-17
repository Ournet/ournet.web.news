'use strict';

var data = require('../data');
var logger = require('../logger');

exports.weatherWidget = function(locals) {
	var config = locals.config;
	var culture = locals.currentCulture;

	return data.common.widgets.getWeatherWidget({
			lang: culture.language,
			host: config.projects.weather,
			id: config.capitalId
		}, { timeout: 1000 * 5 })
		.catch(function(error) {
			logger.error('weatherWidget error', error);
			return {};
		});
};

exports.exchangeWidget = function(locals) {
	var config = locals.config;
	var culture = locals.currentCulture;

	return data.common.widgets.getExchangeWidget({
			lang: culture.language,
			host: config.projects.exchange
		}, { timeout: 1000 * 5 })
		.catch(function(error) {
			logger.error('exchangeWidget error', error);
			return {};
		});
};
