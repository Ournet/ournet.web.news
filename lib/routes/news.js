'use strict';

var express = require('express');
var core = require('ournet.core');
var Promise = core.Promise;
var utils = require('../utils.js');
/*eslint new-cap:1*/
var route = module.exports = express.Router();
var ShareInfo = require('../share_info.js');
var Data = require('../data');

var invalidNews = ['a9ae000223e1e0da1229481b02313cd9', '5d271874d17b8da88c7b7adc9408783d', '7c7b2e138d06156ff06c752e4e14d7a4', '46c174cd5129a7ee67640f34565fe32a'];

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
		relatedNews: Data.webdata.access.stories({
			culture: currentCulture,
			limit: 2,
			order: '-createdAt'
		}, {
			cache: true
		})
	};

	Promise.props(props).then(function(result) {
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
		res.locals.site.head.description = core.text.wrapAt(story.summary, 200);

		res.locals.shareInfo = ShareInfo({
			clientId: 'item-' + id,
			identifier: res.locals.site.head.canonical,
			url: res.locals.site.head.canonical,
			title: res.locals.site.head.title,
			summary: res.locals.site.head.description
		});
		res.locals.story = result.story;
		res.locals.relatedNews = result.relatedNews;
		res.render('item.jade');
	}).catch(next);
});
