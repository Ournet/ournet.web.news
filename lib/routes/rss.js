'use strict';

var express = require('express');
var utils = require('../utils');
var _ = utils._;
// var Promise = utils.Promise;
var util = require('util');
/*eslint new-cap:1*/
var route = module.exports = express.Router();
var Data = require('../data');
var Rss = require('rss');

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

function createFeedItem(links, story, config, lang) {
	var url = 'http://' + config.host + links.story(story.uniqueName, story.id, { ul: lang, utm_source: 'rss', utm_medium: 'link', utm_campaign: 'rss' });

	var item = {
		title: story.title,
		description: utils.wrapAt(story.summary, 250),
		url: url,
		guid: 'story-' + story.id,
		date: story.createdAt,
		enclosure: {
			url: links.wi('large', story.imageId)
		}
		// custom_elements: [{
		// 	'content:encoded': story.summary.replace(/\n+/g, '<br/>')
		// }]
	};

	return item;
}

//topic
route.get('/:ul' + utils.localePrefix + '?/rss/stories/topic/:uniqueName.xml', function(req, res, next) {
	var config = res.locals.config;
	var uniqueName = req.params.uniqueName.toLowerCase();
	var cacheTtl = 30; // 30 minutes


	utils.maxage(res, cacheTtl * 60);

	var currentCulture = res.locals.currentCulture;
	var lang = currentCulture.lang;
	// var currentDate = res.locals.currentDate;
	var links = res.locals.links;
	var __ = res.locals.__;

	topicByUniqueName(currentCulture, uniqueName)
		.then(function(topic) {
			if (!topic) {
				return res.redirect(links.home({
					ul: lang
				}));
			}

			var canonical = 'http://' + config.host + links.rss.stories.topic(topic.slug, {
				ul: lang
			});

			if (topic.slug !== uniqueName) {
				return res.redirect(canonical);
			}

			var name = (topic.abbr && topic.abbr !== topic.name ? (topic.name + ' (' + topic.abbr + ')') : topic.name);

			var title = util.format(__('page_topic_stories_title'), name);
			var description = util.format(__('topic_description'), name);

			var feed = new Rss({
				title: title,
				description: description,
				feed_url: canonical,
				site_url: 'http://' + config.host + links.topic(topic.slug, { ul: lang }),
				language: lang,
				pubDate: new Date(),
				ttl: cacheTtl,
				generator: config.name
			});

			return Data.stories.access.topicStoriesIds(topic.id, {
					limit: 10
				}).then(function(ids) {
					if (!ids || ids.length === 0) {
						return [];
					}
					return Data.stories.access.stories(ids, {
						params: {
							AttributesToGet: utils.storiesAttributes
						},
						sort: true
					});
				})
				.then(function(stories) {
					stories.forEach(function(story) {
						feed.item(createFeedItem(links, story, config, lang));
					});

					res.set('Content-Type', 'application/rss+xml');
					res.send(feed.xml());
				});

		}, next);
});

//latest stories
route.get('/:ul' + utils.localePrefix + '?/rss/stories.xml', function(req, res, next) {
	var config = res.locals.config;
	var cacheTtl = 30; // 30 minutes


	utils.maxage(res, cacheTtl * 60);

	var currentCulture = res.locals.currentCulture;
	var lang = currentCulture.lang;
	// var currentDate = res.locals.currentDate;
	var links = res.locals.links;
	var __ = res.locals.__;


	var feed = new Rss({
		title: __('stories'),
		// description: description,
		feed_url: 'http://' + config.host + links.rss.stories({ ul: lang }),
		site_url: 'http://' + config.host,
		language: lang,
		pubDate: new Date(),
		ttl: cacheTtl,
		generator: config.name
	});

	Data.news.access.stories({
			culture: currentCulture,
			limit: 10,
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
		})
		.then(function(stories) {
			stories.forEach(function(story) {
				feed.item(createFeedItem(links, story, config, lang));
			});

			res.set('Content-Type', 'application/rss+xml');
			res.send(feed.xml());
		}, next);
});

//important stories
route.get('/:ul' + utils.localePrefix + '?/rss/stories/important.xml', function(req, res, next) {
	var config = res.locals.config;
	var cacheTtl = 30; // 30 minutes


	utils.maxage(res, cacheTtl * 60);

	var currentCulture = res.locals.currentCulture;
	var lang = currentCulture.lang;
	// var currentDate = res.locals.currentDate;
	var links = res.locals.links;
	var __ = res.locals.__;

	var feed = new Rss({
		title: __('important_news'),
		// description: description,
		feed_url: 'http://' + config.host + links.rss.stories.important({ ul: lang }),
		site_url: 'http://' + config.host + links.important({ ul: lang }),
		language: lang,
		pubDate: new Date(),
		ttl: cacheTtl,
		generator: config.name
	});

	return Data.stories.access.importantStoriesIds(
			[currentCulture.country, currentCulture.language].join('_'), {
				limit: 10
			}).then(function(storiesIds) {
			if (!storiesIds || storiesIds.length === 0) {
				return [];
			}
			return Data.stories.access.stories(storiesIds, {
				params: {
					AttributesToGet: utils.storiesAttributes
				},
				sort: true
			});
		})
		.then(function(stories) {
			stories.forEach(function(story) {
				feed.item(createFeedItem(links, story, config, lang));
			});

			res.set('Content-Type', 'application/rss+xml');
			res.send(feed.xml());
		}, next);
});
