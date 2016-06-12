'use strict';

require('dotenv').load();

var logger = require('./logger');

var isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
	logger.warn('Starting app...', {
		maintenance: 'start'
	});
}

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var routes = require('./routes');
var i18n = require('./i18n');
var utils = require('./utils');
var boot = require('./boot');
var path = require('path');

function catchError(req, res, error) {
	logger.error(error.message || 'errorHandler', {
		hostname: req.hostname,
		url: req.originalUrl,
		stack: error.stack
	});

	utils.maxage(res, 0);

	var statusCode = error.code || error.statusCode || 500;
	statusCode = statusCode < 200 ? 500 : statusCode;

	res.status(statusCode).send('Error!');
}

function createApp() {
	var app = express();

	app.locals.NODE_ENV = process.env.NODE_ENV;

	app.disable('x-powered-by');
	app.set('view engine', 'jade');
	app.set('views', path.join(__dirname, 'views'));
	//app.set('utils', utils);
	app.disable('etag');
	//app.set(require('./etag'));

	app.use(bodyParser.json()); // to support JSON-encoded bodies
	app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
		extended: true
	}));
	app.use(methodOverride());
	//app.use(responseTime());
	if (!isProduction) {
		app.use(require('morgan')('dev'));
	}

	app.use(boot);

	if (isProduction) {
		app.use(function(req, res, next) {
			if (!req.headers['x-amz-cf-id']) {
				var config = res.locals.config;
				return res.redirect('http://' + config.host + req.originalUrl);
			}
			next();
		});
	}
	app.use(express.static(path.join(__dirname, 'public'), {
		maxAge: isProduction ? (1000 * 60 * 15) : 0
	}));

	app.use(i18n);
	routes(app);

	app.all('*', function(req, res) {
		var currentCulture = res.locals.currentCulture,
			links = res.locals.links;
		res.redirect(links.home({
			ul: currentCulture.lang
		}));
	});

	/*eslint no-unused-vars:1*/
	app.use(function(error, req, res, next) {
		catchError(req, res, error);
	});

	app.on('uncaughtException', function(req, res, route, error) {
		catchError(req, res, error);
	});

	app.listen(process.env.PORT);
	console.log('Server started on port', process.env.PORT);
}

createApp();

process.on('uncaughtException', function(err) {
	logger.error('uncaughtException: ' + err.message, {
		trace: err.trace
	});
});
