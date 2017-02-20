'use strict';

var express = require('express');
var utils = require('../utils');
const _ = utils._;
/*eslint new-cap:1*/
var route = module.exports = express.Router();
var Data = require('../data');
var logger = require('../logger');

//index

route.get('/:ul' + utils.localePrefix + '?/sources', function(req, res, next) {
	const config = res.locals.config;

	utils.maxageSources(res);

	const culture = res.locals.currentCulture;
	const links = res.locals.links;
	const __ = res.locals.__;

	res.locals.site.head.canonical = config.protocol + '//' + config.host + links.news.sources({
		ul: culture.language
	});

	res.locals.title = res.locals.site.head.title = __('news_sources') + ': ' + culture.countryName;

	res.viewdata.latestStories = ['newsStories', { country: culture.country, lang: culture.language, where: '', limit: 3, order: '-_id' }];
	res.viewdata.newsFeeds = ['feeds', { where: JSON.stringify({ country: culture.country, lang: culture.lang, status: 'active' }), limit: 100, order: '' }];

	Data.get(res.viewdata).then(function(result) {
		return Data.get({
			sources: ['websites', { where: JSON.stringify({ _id: { $in: _.map(result.newsFeeds, 'websiteId') } }), limit: 50, order: 'host' }]
		}).then(function(result2) {
			result.sources = result2.sources;
			res.render('sources', result);
		});

	}, next);

});

route.get('/:ul' + utils.localePrefix + '?/source/:host', function(req, res, next) {
	const config = res.locals.config;
	const host = req.params.host.toLowerCase();

	utils.maxageSource(res);

	const culture = res.locals.currentCulture;
	const links = res.locals.links;
	const __ = res.locals.__;

	res.locals.site.head.canonical = config.protocol + '//' + config.host + links.news.source(host, {
		ul: culture.language
	});
	res.locals.title = res.locals.site.head.title = utils.startWithUpperCase(host) + ': ' + __('latest_news');

	res.viewdata.latestStories = ['newsStories', { country: culture.country, lang: culture.language, where: '', limit: 3, order: '-_id' }];

	Data.get({
		website: ['website', { where: JSON.stringify({ host: host }) }]
	}).then(function(result1) {
		const website = result1.website;
		if (!website) {
			logger.error('Not found website: ' + host);
			return res.redirect(links.news.home({
				ul: culture.language
			}));
		}
		res.locals.website = website;

		res.viewdata.news = ['latestWebpages', { country: culture.country, lang: culture.language, where: JSON.stringify({ websiteId: website.id }), limit: 20 }];

		return Data.get(res.viewdata)
			.then(function(result) {
				res.render('source', result);
			});
	}, next);
});
