'use strict';

var data = require('../data');

exports.videos = function(locals, params) {
	return data.videos.access.videos(params);
};
