'use strict';

var data = require('../data');

exports.videos = function(locals, params) {
	return data.videos.access.videos(params);
};

exports.regions = function(locals, params) {
	return data.places.access.placesByTypeAdm1(params.country, params.options)
		.timeout(1000 * 2);
};

exports.region = function(locals, params) {
	return data.places.access.adm1(params)
		.timeout(1000 * 2);
};

exports.placesByAdm1 = function(locals, params) {
	return data.places.access.placesByAdm1Key(params.key, params.options)
		.timeout(1000 * 2);
};
