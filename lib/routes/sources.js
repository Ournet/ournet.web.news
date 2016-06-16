'use strict';

var express = require('express');
var utils = require('../utils');
var _ = utils._;
var Promise = utils.Promise;
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

	Promise.props({
		sources: Data.websites.access.feeds({
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
				});
			}),
		latestStories: Data.webdata.access.stories({
			culture: currentCulture,
			limit: 3,
			order: '-createdAt',
			select: '_id'
		}).then(function(storiesIds) {
			if (!storiesIds || storiesIds.length === 0) {
				return [];
			}
			return Data.stories.access.stories(_.pluck(storiesIds, 'id'), {
				params: {
					AttributesToGet: utils.simpleStoriesAttributes
				},
				sort: true
			});
		})
	}).then(function(result) {
		res.render('sources.jade', result);
	}, next);
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

	Promise.props({
		news: Data.websites.access.website({
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

				return Data.webdata.access.webpages({
					culture: currentCulture,
					where: {
						websiteId: website.id
					},
					order: '-createdAt',
					limit: 20
				});
			}),
		latestStories: Data.webdata.access.stories({
			culture: currentCulture,
			limit: 3,
			order: '-createdAt',
			select: '_id'
		}).then(function(storiesIds) {
			if (!storiesIds || storiesIds.length === 0) {
				return [];
			}
			return Data.stories.access.stories(_.pluck(storiesIds, 'id'), {
				params: {
					AttributesToGet: utils.simpleStoriesAttributes
				},
				sort: true
			});
		})
	}).then(function(result) {
		res.render('source.jade', result);
	}, next);
});
