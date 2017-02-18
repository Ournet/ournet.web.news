'use strict';

const express = require('express');
const utils = require('../utils');
const util = require('util');
const Promise = utils.Promise;
const _ = utils._;
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


			// if (topic.type === 'person') {
			// 	res.viewdata.set({
			// 		quotes: {
			// 			source: 'quotesByAuthor',
			// 			params: {
			// 				authorId: topic.id,
			// 				options: { limit: 5 }
			// 			}
			// 		}
			// 	});
			// } else {
			// 	res.viewdata.set({
			// 		quotes: {
			// 			source: 'quotesAbout',
			// 			params: {
			// 				topicId: topic.id,
			// 				options: { limit: 5 }
			// 			}
			// 		}
			// 	});
			// }

			return Data.get(res.viewdata)
				.then(function(result) {
					res.render('topic', result);
				});

		}, next);
});

//topic stories
route.get('/:ul' + utils.localePrefix + '?/topic/:uniqueName/stories', function(req, res, next) {

	var config = res.locals.config;
	var uniqueName = req.params.uniqueName.toLowerCase();

	utils.maxageTopicStories(res);

	var currentCulture = res.locals.currentCulture;
	// var currentDate = res.locals.currentDate;
	var links = res.locals.links;
	var __ = res.locals.__;

	if (req.query.ul === 'ru') {
		return res.redirect(301, links.topicStories(uniqueName, {
			ul: req.query.ul
		}));
	}

	topicByUniqueName(currentCulture, uniqueName)
		.then(function(topic) {
			res.locals.topic = topic;
			if (!topic) {
				return res.redirect(links.home({
					ul: currentCulture.lang
				}));
			}

			if (topic.slug !== uniqueName) {
				return res.redirect(links.topic(topic.slug, {
					ul: currentCulture.lang
				}));
			}

			res.locals.metaFeeds = [{
				title: util.format(__('page_topic_stories_title'), topic.name),
				url: links.rss.stories.topic(topic.slug, { ul: currentCulture.lang })
			}];

			res.locals.site.head.canonical = 'http://' + config.host + links.topicStories(topic.uniqueName || topic.slug, {
				ul: currentCulture.language
			});

			var name = (topic.abbr && topic.abbr !== topic.name ? (topic.name + ' (' + topic.abbr + ')') : topic.name);

			res.locals.site.head.title = util.format(__('page_topic_stories_title'), name);

			if (topic.category) {
				res.locals.category = Data.topics.categories.category(topic.category);
			}

			res.viewdata.set({
				stories: {
					source: 'topicStories',
					params: {
						topicId: topic.id,
						options: { limit: 12 }
					}
				},
				latestNews: {
					source: 'storiesNews',
					params: {
						culture: currentCulture,
						limit: 5,
						order: '-createdAt',
						select: '_id'
					}
				}
			});

			res.viewdata.get(res.locals, function(error) {
				if (error) {
					return next(error);
				}
				res.render('topic_stories');
			});

		}, next);
});

//topic quotes
route.get('/:ul' + utils.localePrefix + '?/topic/:uniqueName/quotes', function(req, res, next) {
	var config = res.locals.config;
	var uniqueName = req.params.uniqueName.toLowerCase();

	utils.maxageTopicQuotes(res);

	var currentCulture = res.locals.currentCulture;
	// var currentDate = res.locals.currentDate;
	var links = res.locals.links;
	var __ = res.locals.__;

	topicByUniqueName(currentCulture, uniqueName)
		.then(function(topic) {
			res.locals.topic = topic;
			if (!topic) {
				return res.redirect(links.home({
					ul: currentCulture.lang
				}));
			}

			if (topic.slug !== uniqueName) {
				return res.redirect(links.topic(topic.slug, {
					ul: currentCulture.lang
				}));
			}

			res.locals.site.head.canonical = 'http://' + config.host + links.topicQuotes(topic.uniqueName || topic.slug, {
				ul: currentCulture.language
			});

			var name = (topic.abbr && topic.abbr !== topic.name ? (topic.name + ' (' + topic.abbr + ')') : topic.name);

			res.locals.site.head.title = util.format(__('page_topic_quotes_title'), name);

			if (topic.category) {
				res.locals.category = Data.topics.categories.category(topic.category);
			}

			res.viewdata.set({
				latestNews: {
					source: 'storiesNews',
					params: {
						culture: currentCulture,
						limit: 5,
						order: '-createdAt',
						select: '_id'
					}
				}
			});

			if (topic.type === 'person') {
				res.viewdata.set({
					quotes: {
						source: 'quotesByAuthor',
						params: {
							authorId: topic.id,
							options: { limit: 10 }
						}
					}
				});
			} else {
				res.viewdata.set({
					quotes: {
						source: 'quotesAbout',
						params: {
							topicId: topic.id,
							options: { limit: 10 }
						}
					}
				});
			}

			res.viewdata.get(res.locals, function(error) {
				if (error) {
					return next(error);
				}
				res.render('topic_quotes');
			});

		}, next);
});
