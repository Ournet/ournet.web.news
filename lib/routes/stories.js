'use strict';

var express = require('express');
var utils = require('../utils');
var Promise = utils.Promise;
/*eslint new-cap:1*/
var route = module.exports = express.Router();
var Data = require('../data');

//index

route.get('/:ul' + utils.localePrefix + '?/story/:uniqueName-:id(\\d+)', function(req, res, next) {
	var config = res.locals.config;
	var id = parseInt(req.params.id);

	utils.maxageStory(res);

	var currentCulture = res.locals.currentCulture;
	var links = res.locals.links;

	if (req.query.ul === 'ru') {
		return res.redirect(301, links.story(req.params.uniqueName, id, {
			ul: req.query.ul
		}));
	}

	var latestStoriesWhere = {
		_id: {
			$ne: id
		}
	};

	Data.stories.access.story(id)
		.then(function(story) {
			if (!story) {
				return res.redirect(links.home({
					ul: currentCulture.lang
				}));
			}
			story.createdAt = new Date(story.createdAt);

			if (story.createdAt.getTime() > Date.now() - 1000 * 60 * 60 * 2) {
				utils.maxage(res, 10);
			}

			res.locals.story = story;

			res.locals.site.head.canonical = 'http://' + config.host + links.story(story.uniqueName, story.id, {
				ul: currentCulture.language
			});

			res.locals.site.head.title = story.title;
			res.locals.site.head.description = utils.wrapAt(story.summary, 200);

			if (story.category) {
				res.locals.category = Data.topics.categories.category(story.category);
				latestStoriesWhere.category = story.category;
			}

			var props = {
				latestStories: Data.webdata.access.stories({
					culture: currentCulture,
					where: latestStoriesWhere,
					limit: 3,
					order: '-createdAt'
				})
			};
			if (story.countNews > 4 && story.topics && story.topics.length > 0) {
				props.relatedNews = Data.webdata.access.webpages({
					culture: currentCulture,
					where: {
						'topics._id': story.topics[0].id,
						'imageId': {
							$ne: null
						}
					},
					limit: 3,
					order: '-createdAt'
				});
			}

			if (story.quotes && story.quotes.length > 0) {
				props.quotes = Data.quotes.access.quotes(story.quotes);
			}

			return Promise.props(props)
				.then(function(result) {
					res.render('story.jade', result);
				});
		}).catch(next);
});
