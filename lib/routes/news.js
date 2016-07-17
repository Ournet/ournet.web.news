'use strict';

var express = require('express');
var utils = require('../utils');
/*eslint new-cap:1*/
var route = module.exports = express.Router();

var invalidNews = [];

//index

route.get('/:ul' + utils.localePrefix + '?/item/:uniqueName-:id([\\w\\d]{32}$)', function(req, res, next) {
	var config = res.locals.config;
	var id = req.params.id;

	utils.maxageItem(res);

	if (~invalidNews.indexOf(id)) {
		return res.redirect(301, '/');
	}

	var currentCulture = res.locals.currentCulture;
	var links = res.locals.links;

	res.viewdata.set({
		story: {
			source: 'webpage',
			params: {
				culture: currentCulture,
				where: {
					_id: id
				}
			}
		},
		latestStories: {
			source: 'newsStories',
			params: {
				culture: currentCulture,
				limit: 3,
				order: '-createdAt'
			}
		}
	});

	res.viewdata.get(res.locals, function(error) {
		if (error) {
			return next(error);
		}

		var story = res.locals.story;
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

		return res.render('item');
	});
});
