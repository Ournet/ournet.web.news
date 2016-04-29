'use strict';

var express = require('express');
var utils = require('../utils');
var Promise = utils.Promise;
/*eslint new-cap:1*/
var route = module.exports = express.Router();
var Data = require('../data');

var invalidNews = [];

//index

route.get('/:ul' + utils.localePrefix + '?/item/:uniqueName-:id([\\w\\d]{32}$)', function(req, res, next) {
	var config = res.locals.config;
	var id = req.params.id;
	var story;

	utils.maxageItem(res);

	if (~invalidNews.indexOf(id)) {
		return res.redirect(301, '/');
	}

	var currentCulture = res.locals.currentCulture;
	var links = res.locals.links;


	var props = {
		story: Data.webdata.access.webpage({
			culture: currentCulture,
			where: {
				_id: id
			}
		}),
		latestStories: Data.webdata.access.stories({
			culture: currentCulture,
			limit: 3,
			order: '-createdAt'
		}, {
			cache: 0
		})
	};

	Promise.props(props)
		.then(function(result) {
			story = result.story;
			if (!story) {
				//core.logger.warn('Not fount item: ' + id, currentCulture);
				return res.redirect(links.home({
					ul: currentCulture.lang
				}));
			}
			res.locals.site.head.canonical = 'http://' + config.host + links.item(story.uniqueName, story.id, {
				ul: currentCulture.language
			});

			res.locals.site.head.title = story.title;
			res.locals.site.head.description = utils.wrapAt(story.summary, 200);

			res.render('item.jade', result);
		}, next);
});
