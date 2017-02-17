'use strict';

const express = require('express');
const utils = require('../utils');
const util = require('util');
/*eslint new-cap:1*/
const route = module.exports = express.Router();
const Data = require('../data');

//index

route.get('/:ul' + utils.localePrefix + '?', function(req, res, next) {
	const config = res.locals.config;

	utils.maxageIndex(res);

	const culture = res.locals.currentCulture;
	const links = res.locals.links;
	const __ = res.locals.__;

	if (req.query.ul === 'ru') {
		return res.redirect(301, links.news.home({
			ul: req.query.ul
		}));
	}

	res.locals.site.head.canonical = config.protocol + '//' + links.news.host + links.news.home({
		ul: culture.language
	});

	res.locals.site.head.title = util.format(__('site_title'), __('in_country_' + culture.country));

	res.locals.metaFeeds = [{
		title: util.format('%s', __('stories')),
		url: links.news.rss.stories({ ul: culture.lang })
	}];

	const recentPeriod = new Date(res.locals.currentDate);
	recentPeriod.setHours(-72, 0, 0, 0);

	res.viewdata.latestStories = ['newsStories', { country: culture.country, lang: culture.language, where: '', limit: 9, order: '-_id' }];
	res.viewdata.latestQuotes = ['newsQuotes', { where: JSON.stringify({ country: culture.country, lang: culture.language }), limit: 9, order: '-createdAt' }];

	res.viewdata.popularStories = ['newsStories', { country: culture.country, lang: culture.language, where: JSON.stringify({ createdAt: { $gt: recentPeriod } }), limit: 3, order: '-countShares' }];
	res.viewdata.importantStories = ['newsStories', { country: culture.country, lang: culture.language, where: JSON.stringify({ isImportant: true }), limit: 3, order: '-_id' }];

	Data.get(res.viewdata).then(function(result) {
		// console.log(result);
		return res.render('index', result);
	}, next);
});

route.get('/:ul' + utils.localePrefix + '?/:category(politics|business|entertainment|sports|tech|science|live|arts|justice)', function(req, res, next) {
	const config = res.locals.config;

	utils.maxageIndex(res);

	const culture = res.locals.currentCulture;
	const links = res.locals.links;
	const __ = res.locals.__;

	const category = res.locals.category = Data.categories.category(req.params.category);

	res.locals.site.head.canonical = config.protocol + '//' + links.news.host + links.news.category(category.name, {
		ul: culture.language
	});

	res.locals.site.head.title = util.format(__('category_title'), category[culture.lang]);

	const recentPeriod = new Date(res.locals.currentDate);
	recentPeriod.setHours(-72, 0, 0, 0);

	res.viewdata.latestStories = ['newsStories', { country: culture.country, lang: culture.language, where: JSON.stringify({ category: category.id }), limit: 6, order: '-_id' }];
	res.viewdata.latestQuotes = ['newsQuotes', { where: JSON.stringify({ country: culture.country, lang: culture.language, category: category.id }), limit: 6, order: '-createdAt' }];

	res.viewdata.popularStories = ['newsStories', { country: culture.country, lang: culture.language, where: JSON.stringify({ category: category.id, createdAt: { $gt: recentPeriod } }), limit: 3, order: '-countShares' }];

	Data.get(res.viewdata).then(function(result) {
		// console.log(result);
		return res.render('index', result);
	}, next);
});

route.get('/:ul' + utils.localePrefix + '?/search', function(req, res, next) {
	// var config = res.locals.config;

	utils.maxageSearch(res);

	var q = req.query.q;

	const culture = res.locals.currentCulture;
	const links = res.locals.links;

	if (!q || q.trim().length < 2) {
		return res.redirect(links.news.home({
			ul: culture.lang
		}));
	}

	q = q.trim();

	Data.get({
		entity: ['topicByName', { name: q, country: culture.country, lang: culture.lang }]
	}).then(function(result) {
		const entity = result.entity;
		if (!entity) {
			return res.redirect(links.news.home({
				ul: culture.lang
			}));
		}
		return res.redirect(links.news.topic(entity.slug, {
			ul: culture.lang
		}));
	}, next);

});

route.get('/:ul' + utils.localePrefix + '?/popular', function(req, res, next) {
	const config = res.locals.config;

	utils.maxageIndex(res);

	const culture = res.locals.currentCulture;
	const links = res.locals.links;
	const __ = res.locals.__;

	if (req.query.ul === 'ru') {
		return res.redirect(301, links.news.home({
			ul: req.query.ul
		}));
	}

	res.locals.site.head.canonical = config.protocol + '//' + links.news.host + links.news.popular({
		ul: culture.language
	});

	res.locals.site.head.title = res.locals.title = __('popular_news');
	res.locals.selectedMenuType = 'popular';

	const recentPeriod = new Date(res.locals.currentDate);
	recentPeriod.setHours(-72, 0, 0, 0);

	res.viewdata.quotes = ['newsQuotes', { where: JSON.stringify({ country: culture.country, lang: culture.language }), limit: 9, order: '-createdAt' }];
	res.viewdata.stories = ['newsStories', { country: culture.country, lang: culture.language, where: JSON.stringify({ createdAt: { $gt: recentPeriod } }), limit: 12, order: '-countShares' }];

	Data.get(res.viewdata).then(function(result) {
		// console.log(result);
		return res.render('stories', result);
	}, next);
});

route.get('/:ul' + utils.localePrefix + '?/important', function(req, res, next) {
	const config = res.locals.config;

	utils.maxageIndex(res);

	const culture = res.locals.currentCulture;
	const links = res.locals.links;
	const __ = res.locals.__;

	if (req.query.ul === 'ru') {
		return res.redirect(301, links.news.home({
			ul: req.query.ul
		}));
	}

	res.locals.site.head.canonical = config.protocol + '//' + links.news.host + links.news.important({
		ul: culture.language
	});

	res.locals.site.head.title = res.locals.title = __('important_news');
	res.locals.selectedMenuType = 'important';

	res.locals.metaFeeds = [{
		title: util.format('%s', __('important_news')),
		url: links.news.rss.stories.important({ ul: culture.lang })
	}];

	res.viewdata.quotes = ['newsQuotes', { where: JSON.stringify({ country: culture.country, lang: culture.language }), limit: 9, order: '-createdAt' }];
	res.viewdata.stories = ['newsStories', { country: culture.country, lang: culture.language, where: JSON.stringify({ isImportant: true }), limit: 12, order: '-_id' }];

	Data.get(res.viewdata).then(function(result) {
		return res.render('stories', result);
	}, next);
});
