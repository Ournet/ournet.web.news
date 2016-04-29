'use strict';

// var core = require('ournet.core');
// var md5 = core.util.md5;
// var Promise = core.Promise;
// var utils = require('../utils.js');

module.exports = function(req, res, next) {
	// var config = res.locals.config;
	// var currentCulture = res.locals.currentCulture;
	// var lang = currentCulture.language;

	res.locals.selectedMenuType = 'news';

	next();
};
