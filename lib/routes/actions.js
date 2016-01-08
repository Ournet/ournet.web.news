'use strict';

var express = require('express');
var utils = require('../utils.js');
/*eslint new-cap:1*/
var route = module.exports = express.Router();
var Data = require('../data');

//index

route.get('/actions/view_story/:id', function(req, res, next) {
	var id = parseInt(req.params.id);

	utils.maxage(res, 0);

	var currentCulture = res.locals.currentCulture;
	var links = res.locals.links;

	Data.stories.access.story({
		id: id,
		params: {
			AttributesToGet: ['id', 'countViews', 'country', 'lang', 'createdAt']
		}
	}).then(function(story) {
		if (!story) {
			return res.redirect(links.home({
				ul: currentCulture.lang
			}));
		}
		story.createdAt = new Date(story.createdAt);
		var count = story.countViews || 0;
		count++;

		return Data.stories.control.updateStory({
				id: id,
				countViews: {
					$add: 1
				}
			})
			.then(function() {
				if (Date.now() > story.createdAt.getTime() - (1000 * 60 * 60 * 24 * 14)) {
					return Data.webdata.control.updateStory({
						id: id,
						country: story.country,
						lang: story.lang,
						countViews: count
					}).then(function() {
						res.send((count).toString());
					});
				}
				res.send((count).toString());
			});
	}).catch(next);
});
