'use strict';

var express = require('express');
var utils = require('../utils');
/*eslint new-cap:1*/
var route = module.exports = express.Router();

route.get('/favicon.ico', function(req, res) {
	var config = res.locals.config;
	utils.maxage(res, 60 * 24 * 14);
	return res.redirect(301, config.getFavicon());
});

route.get('/:ul' + utils.localePrefix + '?/url', function(req, res) {
	var url = req.query.url;
	if (!url) {
		return res.redirect('/');
	}

	res.redirect('http://' + url);
});
