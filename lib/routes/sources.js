'use strict';

var express = require('express');
var utils = require('../utils');
var _ = utils._;
/*eslint new-cap:1*/
var route = module.exports = express.Router();
var Data = require('../data');
var logger = require('../logger');

//index

route.get('/:ul' + utils.localePrefix + '?/sources', function(req, res, next) {
	var config = res.locals.config;

	utils.maxageSources(res);

	var currentCulture = res.locals.currentCulture,
		links = res.locals.links,
		__ = res.locals.__;

	res.locals.site.head.canonical = 'http://' + config.host + links.sources({
		ul: currentCulture.language
	});

	res.locals.title = res.locals.site.head.title = __('news_sources') + ': ' + currentCulture.countryName;

	Data.websites.access.feeds({
			where: {
				country: currentCulture.country,
				lang: currentCulture.lang,
				status: 'active'
			},
			select: 'websiteId',
			limit: 100
		})
		.then(function(feeds) {
			return Data.websites.access.websites({
				where: {
					_id: {
						$in: _.uniq(_.pluck(feeds, 'websiteId'))
					}
				},
				select: 'host title',
				order: 'host',
				limit: 100
			}).then(function(websites) {
				res.locals.sources = websites;
				res.render('sources.jade');
			});
		})
		.catch(next);
});

route.get('/:ul' + utils.localePrefix + '?/source/:host', function(req, res, next) {
	var config = res.locals.config;
	var host = req.params.host.toLowerCase();

	utils.maxageSource(res);

	var currentCulture = res.locals.currentCulture,
		links = res.locals.links,
		__ = res.locals.__;

	res.locals.site.head.canonical = 'http://' + config.host + links.source(host, {
		ul: currentCulture.language
	});
	res.locals.title = res.locals.site.head.title = utils.startWithUpperCase(host) + ': ' + __('latest_news');

	Data.websites.access.website({
			host: host
		})
		.then(function(website) {
			if (!website) {
				logger.error('Not found website: ' + host);
				return res.redirect(links.home({
					ul: currentCulture.language
				}));
			}

			return Data.webdata.access.webpages({
				culture: currentCulture,
				where: {
					websiteId: website.id
				},
				order: '-createdAt',
				limit: 20
			}).then(function(news) {
				res.locals.news = news;
				res.render('source.jade');
			});
		})
		.catch(next);
});
