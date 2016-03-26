'use strict';

var logger = module.exports = require('ournet.logger');

if (process.env.NODE_ENV === 'production') {
	logger.loggly({
		tags: ['news', 'web'],
		json: true
	});
	logger.removeConsole();
}
