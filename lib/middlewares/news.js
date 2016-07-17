'use strict';

var _package = require('../../package.json');
var utils = require('../utils');
var entipicUrl = require('entipic.url');
var Data = require('../data');

var util = {
	moment: utils.moment,
	format: require('util').format,
	startWithUpperCase: utils.startWithUpperCase,
	numberFormat: utils.number.format,
	wrapAt: utils.wrapAt,
	url: require('url'),
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
	},
	summaryToParagraphs: utils.summaryToParagraphs
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

	res.viewdata.set({
		// exchangeWidget: !!config.projects.exchange,
		weatherWidget: true,
		trendingTopics: {
			params: {
				where: {
					country: culture.country,
					lang: culture.lang
				},
				limit: 8,
				order: '-counts.trend24h'
			}
		}
	});

	next();
};
