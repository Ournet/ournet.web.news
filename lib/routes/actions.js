'use strict';

var express = require('express');
var utils = require('../utils.js');
/*eslint new-cap:1*/
var route = module.exports = express.Router();
var Data = require('../data');

//index

route.get('/actions/view_story/:id', function(req, res, next) {
	const id = parseInt(req.params.id);

	utils.maxage(res, 0);

	const culture = res.locals.currentCulture;
	const links = res.locals.links;

	Data.mutate({
			story: ['viewStory', { id: id }]
		})
		.then(function(result) {
			const story = result.story;

			if (!story) {
				return res.redirect(links.news.home({
					ul: culture.lang
				}));
			}

			res.send((story.countViews).toString());
		}, next);
});
