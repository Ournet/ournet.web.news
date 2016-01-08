'use strict';

var url = require('url');

module.exports = function(req, res, next) {
	var ref = req.header('Referer');
	if (!ref || url.parse(ref).hostname !== req.hostname) {
		//return res.status(401);
	}
	next();
};
