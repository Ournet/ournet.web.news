'use strict';

var _package = require('../../package.json');
var utils = require('../utils');
var entipicUrl = require('entipic.url');
const Data = require('../data');

const util = {
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
	summaryToParagraphs: utils.summaryToParagraphs,
	isNormalNewsTitle: utils.isNormalNewsTitle,
	compareTitles: utils.compareTitles,
	weather: Data.weather,
	Place: Data.Place,
	signName: Data.signName
};

module.exports = function(req, res, next) {
	var config = res.locals.config;
	var culture = res.locals.currentCulture;
	const links = res.locals.links;

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

	res.locals.categories = Data.categories.all();

	res.locals.newsUrl = function(url) {
		return '//' + links.news.host + url;
	};

	res.locals._events = [];

	utils.maxage(res, 60);

	res.viewdata.trendingTopics = ['trendingTopics', {
		where: JSON.stringify({
			country: culture.country,
			lang: culture.lang
		}),
		limit: 8,
		order: '-counts.trend24h'
	}];

	// res.viewdata.holidays = ['holidays', { country: country, lang: language }];
	res.viewdata.capitalCity = ['placeCurrentForecast', { placeId: config.capitalId }];

	next();
};
