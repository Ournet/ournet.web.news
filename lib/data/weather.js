'use strict';

const Symbols = require('metno-symbols');

exports.symbolName = function(symbol, lang) {
	symbol = typeof symbol === 'number' ? symbol : symbol.number;
	return Symbols.symbolName(symbol, lang) || '';
};

exports.formatForecastKey = function(place) {
	return [place.latitude.toFixed(1), place.longitude.toFixed(1)].join(':');
};

exports.formatAlarmKey = function(country, date) {
	return [country.toUpperCase(), date.toString()].join('');
};

exports.formatAlarmRangeKey = function(level, type, coordinates) {
	var key = level.toString();

	if (type) {
		key += '_' + type.toString();
		if (coordinates) {
			key += '_' + [coordinates.lat.toFixed(1), coordinates.lng.toFixed(1)].join(':');
		}
	}

	return key;
};

exports.formatDailyReportKey = function(forecastKey, date) {
	return [forecastKey.trim().toLowerCase(), date.replace(/-/g, '')].join('#');
};
