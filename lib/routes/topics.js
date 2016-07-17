'use strict';

var express = require('express');
var utils = require('../utils');
var util = require('util');
/*eslint new-cap:1*/
var route = module.exports = express.Router();
var Data = require('../data');

function topicByUniqueName(currentCulture, uniqueName) {
	var key = utils.md5([currentCulture.country, currentCulture.lang, uniqueName.replace(/-/g, ' ')].join('_'));
	// console.log(key, currentCulture.country, currentCulture.lang);
	return Data.topics.access.entityNameByKey(key, {
			params: {
				ProjectionExpression: 'entityId'
			}
		})
		.then(function(entityName) {
			// console.log('entityName', entityName);
			if (entityName) {
				return Data.topics.access.entityById(entityName.entityId);
			}
			return entityName;
		});
}

//topic
route.get('/:ul' + utils.localePrefix + '?/topic/:uniqueName', function(req, res, next) {
	var config = res.locals.config;
	var uniqueName = req.params.uniqueName.toLowerCase();

	utils.maxageTopic(res);

	var currentCulture = res.locals.currentCulture;
	// var currentDate = res.locals.currentDate;
	var links = res.locals.links;
	var __ = res.locals.__;

	if (req.query.ul === 'ru') {
		return res.redirect(301, links.topic(uniqueName, {
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

			res.locals.site.head.canonical = 'http://' + config.host + links.topic(topic.uniqueName || topic.slug, {
				ul: currentCulture.language
			});

			var name = (topic.abbr && topic.abbr !== topic.name ? (topic.name + ' (' + topic.abbr + ')') : topic.name);

			res.locals.site.head.title = util.format(__('page_topic_title'), name);
			res.locals.site.head.description = util.format(__('topic_description'), name);
			res.locals.site.head.keywords = [topic.name, __('news'), __('stories'), currentCulture.countryName].join(', ');

			res.locals.subtitle = res.locals.site.head.description;
			res.locals.title = util.format(__('topic_title'), topic.abbr || topic.name);

			if (topic.category) {
				res.locals.category = Data.topics.categories.category(topic.category);
			}

			res.locals.metaFeeds = [{
				title: util.format(__('page_topic_stories_title'), topic.name),
				url: links.rss.stories.topic(topic.slug, { ul: currentCulture.lang })
			}];

			res.viewdata.set({
				stories: {
					source: 'topicStories',
					params: {
						topicId: topic.id,
						options: { limit: 6 }
					}
				},
				latestNews: {
					source: 'webpages',
					params: {
						culture: currentCulture,
						where: {
							'topics._id': topic.id
						},
						limit: 6,
						order: '-createdAt'
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

			if (topic.type === 'person') {
				res.viewdata.set({
					quotes: {
						source: 'quotesByAuthor',
						params: {
							authorId: topic.id,
							options: { limit: 5 }
						}
					}
				});
			} else {
				res.viewdata.set({
					quotes: {
						source: 'quotesAbout',
						params: {
							topicId: topic.id,
							options: { limit: 5 }
						}
					}
				});
			}

			res.viewdata.get(res.locals, function(error) {
				if (error) {
					return next(error);
				}
				res.render('topic');
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
