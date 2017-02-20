'use strict';

const express = require('express');
const utils = require('../utils');
/*eslint new-cap:1*/
const route = module.exports = express.Router();
const Data = require('../data');

const invalidNews = [];

//index

route.get('/:ul' + utils.localePrefix + '?/item/:uniqueName-:id([\\w\\d]{32}$)', function(req, res, next) {
	const config = res.locals.config;
	const id = req.params.id;

	utils.maxageItem(res);

	if (~invalidNews.indexOf(id)) {
		return res.redirect(301, '/');
	}

	const culture = res.locals.currentCulture;
	const links = res.locals.links;

	res.viewdata.story = ['webpage', { id: id, country: culture.country, lang: culture.lang }];
	res.viewdata.latestStories = ['newsStories', { country: culture.country, lang: culture.language, where: '', limit: 3, order: '-_id' }];

	Data.get(res.viewdata).then(function(result) {
		const story = result.story;
		if (!story) {
			return res.redirect(links.news.home({
				ul: culture.lang
			}));
		}

		res.locals.site.head.canonical = config.protocol + '//' + config.host + links.news.item(story.slug, story.id, {
			ul: culture.language
		});

		res.locals.site.head.title = story.title;
		res.locals.site.head.description = utils.wrapAt(story.summary, 200);

		return res.render('item', result);
	}, next);
});
