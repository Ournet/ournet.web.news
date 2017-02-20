'use strict';

const express = require('express');
const utils = require('../utils');
const util = require('util');
/*eslint new-cap:1*/
const route = module.exports = express.Router();
const Data = require('../data');

function topicByName(culture, name) {
	return Data.get({
		entity: ['topicByName', { name: name, country: culture.country, lang: culture.lang }]
	}).then(function(result) {
		return result.entity;
	});
}

//topic
route.get('/:ul' + utils.localePrefix + '?/topic/:uniqueName', function(req, res, next) {
	const config = res.locals.config;
	const uniqueName = req.params.uniqueName.toLowerCase();

	utils.maxageTopic(res);

	const culture = res.locals.currentCulture;
	// var currentDate = res.locals.currentDate;
	const links = res.locals.links;
	const __ = res.locals.__;

	if (req.query.ul === 'ru') {
		return res.redirect(301, links.news.topic(uniqueName, {
			ul: req.query.ul
		}));
	}

	topicByName(culture, uniqueName)
		.then(function(topic) {
			res.locals.topic = topic;
			if (!topic) {
				return res.redirect(links.news.home({
					ul: culture.lang
				}));
			}
			if (topic.slug !== uniqueName) {
				return res.redirect(links.news.topic(topic.slug, {
					ul: culture.lang
				}));
			}

			res.locals.site.head.canonical = config.protocol + '//' + config.host + links.news.topic(topic.slug, {
				ul: culture.language
			});

			const name = (topic.abbr && topic.abbr !== topic.name ? (topic.name + ' (' + topic.abbr + ')') : topic.name);

			res.locals.site.head.title = util.format(__('page_topic_title'), name);
			res.locals.site.head.description = util.format(__('topic_description'), name);
			res.locals.site.head.keywords = [topic.name, __('news'), __('stories'), culture.countryName].join(', ');

			res.locals.subtitle = res.locals.site.head.description;
			res.locals.title = util.format(__('topic_title'), topic.abbr || topic.name);

			if (topic.category) {
				res.locals.category = Data.categories.category(topic.category);
			}

			res.locals.metaFeeds = [{
				title: util.format(__('page_topic_stories_title'), topic.name),
				url: links.news.rss.stories.topic(topic.slug, { ul: culture.lang })
			}];

			res.viewdata.topicStories = ['topicStories', { topicId: topic.id, limit: 6 }];
			res.viewdata.latestNews = ['latestWebpages', { limit: 6, country: culture.country, lang: culture.lang, where: JSON.stringify({ 'topics._id': topic.id }) }];
			res.viewdata.latestStories = ['newsStories', { country: culture.country, lang: culture.language, where: '', limit: 3, order: '-_id' }];


			if (topic.type === 'person') {
				res.viewdata.quotes = ['quotesByAuthorId', { authorId: topic.id, limit: 5 }];
			} else {
				res.viewdata.quotes = ['quotesByTopicId', { topicId: topic.id, limit: 5 }];
			}

			return Data.get(res.viewdata)
				.then(function(result) {
					console.log(result.errors);
					res.render('topic', result);
				});

		}, next);
});

//topic stories
route.get('/:ul' + utils.localePrefix + '?/topic/:uniqueName/stories', function(req, res, next) {

	const config = res.locals.config;
	const uniqueName = req.params.uniqueName.toLowerCase();

	utils.maxageTopicStories(res);

	const culture = res.locals.currentCulture;
	// var currentDate = res.locals.currentDate;
	const links = res.locals.links;
	const __ = res.locals.__;

	if (req.query.ul === 'ru') {
		return res.redirect(301, links.news.topicStories(uniqueName, {
			ul: req.query.ul
		}));
	}

	topicByName(culture, uniqueName)
		.then(function(topic) {
			res.locals.topic = topic;
			if (!topic) {
				return res.redirect(links.news.home({
					ul: culture.lang
				}));
			}

			if (topic.slug !== uniqueName) {
				return res.redirect(links.news.topic(topic.slug, {
					ul: culture.lang
				}));
			}

			res.locals.metaFeeds = [{
				title: util.format(__('page_topic_stories_title'), topic.name),
				url: links.news.rss.stories.topic(topic.slug, { ul: culture.lang })
			}];

			res.locals.site.head.canonical = config.protocol + '//' + config.host + links.news.topicStories(topic.slug || topic.slug, {
				ul: culture.language
			});

			const name = (topic.abbr && topic.abbr !== topic.name ? (topic.name + ' (' + topic.abbr + ')') : topic.name);

			res.locals.site.head.title = util.format(__('page_topic_stories_title'), name);

			if (topic.category) {
				res.locals.category = Data.categories.category(topic.category);
			}

			res.viewdata.topicStories = ['topicStories', { topicId: topic.id, limit: 12 }];
			res.viewdata.latestStories = ['newsStories', { country: culture.country, lang: culture.language, where: '', limit: 3, order: '-_id' }];

			return Data.get(res.viewdata).then(function(result) {
				res.render('topic_stories', result);
			});
		}, next);
});

//topic quotes
route.get('/:ul' + utils.localePrefix + '?/topic/:uniqueName/quotes', function(req, res, next) {
	const config = res.locals.config;
	const uniqueName = req.params.uniqueName.toLowerCase();

	utils.maxageTopicQuotes(res);

	const culture = res.locals.currentCulture;
	// var currentDate = res.locals.currentDate;
	const links = res.locals.links;
	const __ = res.locals.__;

	topicByName(culture, uniqueName)
		.then(function(topic) {
			res.locals.topic = topic;
			if (!topic) {
				return res.redirect(links.news.home({
					ul: culture.lang
				}));
			}

			if (topic.slug !== uniqueName) {
				return res.redirect(links.news.topic(topic.slug, {
					ul: culture.lang
				}));
			}

			res.locals.site.head.canonical = config.protocol + '//' + config.host + links.news.topicQuotes(topic.slug || topic.slug, {
				ul: culture.language
			});

			const name = (topic.abbr && topic.abbr !== topic.name ? (topic.name + ' (' + topic.abbr + ')') : topic.name);

			res.locals.site.head.title = util.format(__('page_topic_quotes_title'), name);

			if (topic.category) {
				res.locals.category = Data.categories.category(topic.category);
			}

			res.viewdata.latestStories = ['newsStories', { country: culture.country, lang: culture.language, where: '', limit: 3, order: '-_id' }];

			if (topic.type === 'person') {
				res.viewdata.quotes = ['quotesByAuthorId', { authorId: topic.id, limit: 10 }];
			} else {
				res.viewdata.quotes = ['quotesByTopicId', { topicId: topic.id, limit: 10 }];
			}

			return Data.get(res.viewdata).then(function(result) {
				res.render('topic_quotes', result);
			});

		}, next);
});
