'use strict';

const express = require('express');
const utils = require('../utils');
// var _ = utils._;
// var Promise = utils.Promise;
const util = require('util');
/*eslint new-cap:1*/
const route = module.exports = express.Router();
const Data = require('../data');
const Rss = require('rss');
const Links = require('ournet.links');

function topicByName(culture, name) {
	return Data.get({
		entity: ['topicByName', { name: name, country: culture.country, lang: culture.lang }]
	}).then(function(result) {
		return result.entity;
	});
}

function createFeedItem(links, story, config, lang) {
	var url = config.protocol + '//' + config.host + links.news.story(story.slug, story.id, { ul: lang, utm_source: 'rss', utm_medium: 'link', utm_campaign: 'rss' });

	var item = {
		title: story.title,
		description: utils.wrapAt(story.summary, 250),
		url: url,
		guid: 'story-' + story.id,
		date: story.createdAt,
		enclosure: {
			url: Links.cdn.wi.stories('large', story.imageId)
		}
		// custom_elements: [{
		// 	'content:encoded': story.summary.replace(/\n+/g, '<br/>')
		// }]
	};

	return item;
}

//topic
route.get('/:ul' + utils.localePrefix + '?/rss/stories/topic/:uniqueName.xml', function(req, res, next) {
	const config = res.locals.config;
	const uniqueName = req.params.uniqueName.toLowerCase();
	const cacheTtl = 30; // 30 minutes


	utils.maxage(res, cacheTtl * 60);

	const culture = res.locals.currentCulture;
	const lang = culture.lang;
	// var currentDate = res.locals.currentDate;
	const links = res.locals.links;
	const __ = res.locals.__;

	topicByName(culture, uniqueName)
		.then(function(topic) {
			if (!topic) {
				return res.redirect(links.news.home({
					ul: lang
				}));
			}

			const canonical = config.protocol + '//' + config.host + links.news.rss.stories.topic(topic.slug, {
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
				site_url: config.protocol + '//' + config.host + links.news.topic(topic.slug, { ul: lang }),
				language: lang,
				pubDate: new Date(),
				ttl: cacheTtl,
				generator: config.name
			});

			return Data.get({
				stories: ['topicStories', { topicId: topic.id, limit: 10 }]
			}).then(function(result) {
				result.stories.forEach(function(story) {
					feed.item(createFeedItem(links, story, config, lang));
				});

				res.set('Content-Type', 'application/rss+xml');
				res.send(feed.xml());
			});

		}, next);
});

//latest stories
route.get('/:ul' + utils.localePrefix + '?/rss/stories.xml', function(req, res, next) {
	const config = res.locals.config;
	const cacheTtl = 30; // 30 minutes


	utils.maxage(res, cacheTtl * 60);

	const culture = res.locals.currentCulture;
	const lang = culture.lang;
	// var currentDate = res.locals.currentDate;
	const links = res.locals.links;
	const __ = res.locals.__;


	const feed = new Rss({
		title: __('stories'),
		// description: description,
		feed_url: config.protocol + '//' + config.host + links.news.rss.stories({ ul: lang }),
		site_url: config.protocol + '//' + config.host,
		language: lang,
		pubDate: new Date(),
		ttl: cacheTtl,
		generator: config.name
	});

	Data.get({
		stories: ['newsStories', { country: culture.country, lang: culture.language, where: '', limit: 10, order: '-_id' }]
	}).then(function(result) {
		result.stories.forEach(function(story) {
			feed.item(createFeedItem(links, story, config, lang));
		});

		res.set('Content-Type', 'application/rss+xml');
		res.send(feed.xml());
	}, next);
});

//important stories
route.get('/:ul' + utils.localePrefix + '?/rss/stories/important.xml', function(req, res, next) {
	const config = res.locals.config;
	const cacheTtl = 30; // 30 minutes


	utils.maxage(res, cacheTtl * 60);

	const culture = res.locals.currentCulture;
	const lang = culture.lang;
	// var currentDate = res.locals.currentDate;
	const links = res.locals.links;
	const __ = res.locals.__;

	const feed = new Rss({
		title: __('important_news'),
		// description: description,
		feed_url: config.protocol + '//' + config.host + links.news.rss.stories.important({ ul: lang }),
		site_url: config.protocol + '//' + config.host + links.news.important({ ul: lang }),
		language: lang,
		pubDate: new Date(),
		ttl: cacheTtl,
		generator: config.name
	});

	Data.get({
		stories: ['newsStories', { country: culture.country, lang: culture.language, where: JSON.stringify({ isImportant: true }), limit: 10, order: '-_id' }]
	}).then(function(result) {
		result.stories.forEach(function(story) {
			feed.item(createFeedItem(links, story, config, lang));
		});

		res.set('Content-Type', 'application/rss+xml');
		res.send(feed.xml());
	}, next);
});
