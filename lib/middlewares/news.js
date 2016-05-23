'use strict';

var _package = require('../../package.json');
var utils = require('../utils');
var Promise = utils.Promise;
var entipicUrl = require('entipic.url');
var data = require('ournet.data');
var Data = require('../data');
var logger = require('../logger');

var util = {
	moment: utils.moment,
	format: require('util').format,
	startWithUpperCase: utils.startWithUpperCase,
	numberFormat: utils.number.format,
	wrapAt: utils.wrapAt,
	htmlText: function(text) {
		if (!text) {
			return text;
		}
		return text.trim().replace(/\n/g, '<br/><br/>');
	},
	toUrl: function(item) {
		return '/url?url=' + encodeURIComponent(item.host + item.path);
	},
	entipicImage: function(topic, culture, size) {
		return entipicUrl(topic.wikiName || topic.name, size, culture.language, culture.country);
	}
};

module.exports = function(req, res, next) {
	var config = res.locals.config;
	var culture = res.locals.currentCulture;

	res.locals.selectedMenuType = 'news';

	res.locals.project = {
		version: _package.version,
		name: 'news',
		portalsAbroad: []
	};

	//res.locals.noGoogleAds = true;

	res.locals.util = util;

	res.locals.topBarMenu = [];
	res.locals.showTopPageBar = true;

	res.locals.categories = Data.topics.categories.all();

	for (var project in config.projects) {
		var host = config.projects[project];
		var item = {
			id: project,
			text: res.locals.__(project),
			href: 'http://' + host + res.locals.links.home({
				ul: culture.language
			})
		};
		if (host === config.host) {
			item.cssClass = 'active';
		}
		res.locals.topBarMenu.push(item);
	}

	res.locals._events = [];

	utils.maxage(res, 60);

	var props = {
		weather: data.widgets.getWeatherWidget({
			country: culture.country,
			lang: culture.language,
			host: config.projects.weather,
			id: config.capitalId
		}).catch(function(error) {
			logger.error('weatherWidget error', error);
		}),
		trendingTopics: Data.webdata.access.trendTopics({
			where: {
				country: culture.country,
				lang: culture.lang
			},
			limit: 8,
			order: '-counts.trend24h'
		})
	};
	// if (config.projects.exchange) {
	// 	props.exchange = data.widgets.getExchangeWidget({
	// 		country: culture.country,
	// 		lang: culture.language,
	// 		host: config.projects.exchange
	// 	}).catch(function(error) {
	// 		logger.error('exchangeWidget error', error);
	// 	});
	// }

	Promise.props(props).then(function(result) {
		res.locals.exchangeWidget = result.exchange;
		res.locals.weatherWidget = result.weather;
		res.locals.trendingTopics = result.trendingTopics;
	}).finally(next);
};
