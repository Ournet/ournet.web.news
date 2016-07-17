'use strict';

var express = require('express');
var utils = require('../utils');
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

	res.viewdata.set({
		sources: {
			source: 'newsSources',
			params: {
				where: {
					country: currentCulture.country,
					lang: currentCulture.lang,
					status: 'active'
				},
				select: 'websiteId',
				limit: 100
			}
		},
		latestStories: {
			source: 'storiesNews',
			params: {
				culture: currentCulture,
				limit: 3,
				order: '-createdAt',
				select: '_id'
			}
		}
	});

	res.viewdata.get(res.locals, function(error) {
		if (error) {
			return next(error);
		}
		res.render('sources');
	});
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

	Data.news.access.website({
			where: {
				host: host
			}
		})
		.then(function(website) {
			if (!website) {
				logger.error('Not found website: ' + host);
				return res.redirect(links.home({
					ul: currentCulture.language
				}));
			}
			res.locals.website = website;


			res.viewdata.set({
				news: {
					source: 'webpages',
					params: {
						culture: currentCulture,
						where: {
							websiteId: website.id
						},
						order: '-createdAt',
						limit: 20
					}
				},
				latestStories: {
					source: 'storiesNews',
					params: {
						culture: currentCulture,
						limit: 3,
						order: '-createdAt',
						select: '_id'
					}
				}
			});

			res.viewdata.get(res.locals, function(error) {
				if (error) {
					return next(error);
				}
				res.render('source');
			});

		}, next);

});
