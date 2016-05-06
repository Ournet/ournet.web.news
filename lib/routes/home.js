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
			limit: 9,
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
			limit: 3,
			order: '-countShares',
			where: {
				createdAt: {
					'$gt': recentPeriod
				}
			},
			select: '_id title imageId host href uniqueName countShares countViews videos createdAt summary'
		})
	};

	Promise.props(props)
		.then(function(result) {
			res.render('index.jade', result);
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

	// var recentPeriod = new Date(res.locals.currentDate);
	// recentPeriod.setHours(-24, 0, 0, 0);

	var props = {
		stories: Data.webdata.access.stories({
			culture: currentCulture,
			where: {
				category: category.id
			},
			limit: 6,
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
			limit: 3,
			order: '-countShares',
			where: {
				category: category.id
			},
			select: '_id title imageId host href uniqueName countShares countViews videos createdAt summary'
		})
	};

	Promise.props(props).then(function(result) {
		res.render('index.jade', result);
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

	var key = Data.topics.EntityName.createKey(q, currentCulture.lang, currentCulture.country);

	Data.topics.access.entityByKey(key, { params: { AttributesToGet: ['slug'] } })
		.then(function(entity) {
			if (!entity) {
				return res.redirect(links.home({
					ul: currentCulture.lang
				}));
			}
			return res.redirect(links.topic(entity.slug, {
				ul: currentCulture.lang
			}));
		}, next);

});

route.get('/:ul' + utils.localePrefix + '?/popular', function(req, res, next) {
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

	res.locals.site.head.canonical = 'http://' + config.host + links.popular({
		ul: currentCulture.language
	});

	res.locals.site.head.title = res.locals.title = __('popular_news');
	res.locals.selectedMenuType = 'popular';

	var props = {
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
		stories: Data.webdata.access.stories({
			culture: currentCulture,
			limit: 12,
			order: '-countShares',
			select: '_id title imageId host href uniqueName countShares countViews videos createdAt summary'
		})
	};

	Promise.props(props)
		.then(function(result) {
			res.render('stories.jade', result);
		}, next);
});

// route.get('/:ul' + utils.localePrefix + '?/video', function(req, res, next) {
// 	var config = res.locals.config;

// 	utils.maxageIndex(res);

// 	var currentCulture = res.locals.currentCulture,
// 		links = res.locals.links,
// 		__ = res.locals.__;

// 	if (req.query.ul === 'ru') {
// 		return res.redirect(301, links.home({
// 			ul: req.query.ul
// 		}));
// 	}

// 	res.locals.site.head.canonical = 'http://' + config.host + links.video({
// 		ul: currentCulture.language
// 	});

// 	res.locals.site.head.title = res.locals.title = __('video_news');
// 	res.locals.selectedMenuType = 'video';

// 	var props = {
// 		quotes: Data.webdata.access.quotes({
// 			where: {
// 				country: currentCulture.country,
// 				lang: currentCulture.lang
// 			},
// 			select: '_id',
// 			limit: 3,
// 			order: '-createdAt'
// 		}).then(function(quotesIds) {
// 			return Data.quotes.access.quotes(_.pluck(quotesIds, 'id'), {
// 				sort: true
// 			});
// 		}),
// 		stories: Data.webdata.access.stories({
// 			culture: currentCulture,
// 			limit: 12,
// 			order: '-countShares',
// 			where: {
// 				'videos': {
// 					'$gt': []
// 				}
// 			},
// 			select: '_id title imageId host href uniqueName countShares countViews videos createdAt summary'
// 		})
// 	};

// 	Promise.props(props)
// 		.then(function(result) {
// 			res.render('stories.jade', result);
// 		}, next);
// });
