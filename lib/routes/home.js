'use strict';

var express = require('express');
var utils = require('../utils');
var _ = utils._;
var Promise = utils.Promise;
var util = require('util');
/*eslint new-cap:1*/
var route = module.exports = express.Router();
var Data = require('../data');

//index

route.get('/:ul' + utils.localePrefix + '?', function(req, res, next) {
	var config = res.locals.config;

	utils.maxageIndex(res);

	var currentCulture = res.locals.currentCulture,
		links = res.locals.links,
		__ = res.locals.__;

	if (req.query.ul === 'ru') {
		return res.redirect(301, links.home({
			ul: req.query.ul
		}));
	}

	res.locals.site.head.canonical = 'http://' + config.host + links.home({
		ul: currentCulture.language
	});

	res.locals.site.head.title = util.format(__('site_title'), __('in_country_' + currentCulture.country));

	var recentPeriod = new Date(res.locals.currentDate);
	recentPeriod.setHours(-24, 0, 0, 0);

	var props = {
		stories: Data.webdata.access.stories({
			culture: currentCulture,
			limit: 5,
			order: '-createdAt',
			select: '_id'
		}).then(function(storiesIds) {
			if (!storiesIds || storiesIds.length === 0) {
				return [];
			}
			return Data.stories.access.stories(_.pluck(storiesIds, 'id'), {
				params: {
					AttributesToGet: utils.storiesAttributes
				},
				sort: true
			});
		}),
		quotes: Data.webdata.access.quotes({
			where: {
				country: currentCulture.country,
				lang: currentCulture.lang
			},
			select: '_id',
			limit: 3,
			order: '-createdAt'
		}).then(function(quotesIds) {
			return Data.quotes.access.quotes(_.pluck(quotesIds, 'id'), {
				sort: true
			});
		}),
		popularStories: Data.webdata.access.stories({
			culture: currentCulture,
			limit: 4,
			order: '-countShares',
			where: {
				createdAt: {
					'$gt': recentPeriod
				}
			},
			select: '_id title imageId host href uniqueName countShares countViews videos createdAt'
		})
	};

	Promise.props(props).then(function(result) {
		res.locals.mainStory = result.stories[0];
		res.locals.stories = result.stories.slice(1);
		res.locals.quotes = result.quotes;
		res.locals.popularStories = result.popularStories;

		res.render('index.jade');
	}, next);
});

route.get('/:ul' + utils.localePrefix + '?/:category(politics|business|entertainment|sports|tech|science|live|arts|justice)', function(req, res, next) {
	var config = res.locals.config;

	utils.maxageIndex(res);

	var currentCulture = res.locals.currentCulture,
		links = res.locals.links,
		__ = res.locals.__;

	var category = res.locals.category = Data.topics.categories.category(req.params.category);

	res.locals.site.head.canonical = 'http://' + config.host + links.category(category.name, {
		ul: currentCulture.language
	});

	res.locals.site.head.title = util.format(__('category_title'), category[currentCulture.lang]);

	var recentPeriod = new Date(res.locals.currentDate);
	recentPeriod.setHours(-24, 0, 0, 0);

	var props = {
		stories: Data.webdata.access.stories({
			culture: currentCulture,
			where: {
				category: category.id
			},
			limit: 5,
			order: '-createdAt',
			select: '_id'
		}).then(function(storiesIds) {
			if (!storiesIds || storiesIds.length === 0) {
				return [];
			}
			return Data.stories.access.stories(_.pluck(storiesIds, 'id'), {
				params: {
					AttributesToGet: utils.storiesAttributes
				},
				sort: true
			});
		}),
		quotes: Data.webdata.access.quotes({
			where: {
				country: currentCulture.country,
				lang: currentCulture.lang,
				category: category.id
			},
			select: '_id',
			limit: 3,
			order: '-createdAt'
		}).then(function(quotesIds) {
			return Data.quotes.access.quotes(_.pluck(quotesIds, 'id'), {
				sort: true
			});
		}),
		popularStories: Data.webdata.access.stories({
			culture: currentCulture,
			limit: 4,
			order: '-countShares',
			where: {
				createdAt: {
					'$gt': recentPeriod
				}
			},
			select: '_id title imageId host href uniqueName countShares countViews videos createdAt'
		})
	};

	Promise.props(props).then(function(result) {
		res.locals.mainStory = result.stories[0];
		res.locals.stories = result.stories.slice(1);
		res.locals.quotes = result.quotes;
		res.locals.popularStories = result.popularStories;
		res.render('index.jade');
	}, next);
});

route.get('/:ul' + utils.localePrefix + '?/search', function(req, res, next) {
	var config = res.locals.config;

	utils.maxageSearch(res);

	var q = req.query.q;

	var currentCulture = res.locals.currentCulture,
		links = res.locals.links,
		__ = res.locals.__;

	if (!q || q.trim().length < 2) {
		return res.redirect(links.home({
			ul: currentCulture.lang
		}));
	}

	q = q.trim();

	res.locals.site.head.title = q + ' - ' + config.name;

	res.locals.title = util.format(__('search_result'), q);

	Data.stories.search.searchStories({
		q: q,
		country: currentCulture.country,
		lang: currentCulture.lang
	}).then(function(stories) {
		stories = (stories || []).map(function(item) {
			return item.id;
		});
		res.locals.list = stories;
		if (stories.length > 0) {
			return Data.stories.access.stories(stories, {
				sort: true,
				params: {
					AttributesToGet: utils.storiesAttributes
				}
			}).then(function(list) {
				res.locals.list = list;
				res.render('search.jade');
			});
		} else {
			res.render('search.jade');
		}
	}, next);

});
