'use strict';

var express = require('express');
var utils = require('../utils');
/*eslint new-cap:1*/
var route = module.exports = express.Router();
var Data = require('../data');
var logger = require('../logger');


route.get('/json/weatherstories.json', function(req, res) {
	var config = res.locals.config;
	var links = res.locals.links;
	var culture = {
		country: config.country,
		lang: req.query.ul && config.languages.indexOf(req.query.ul) > -1 && req.query.ul || config.language
	};

	utils.maxage(res, 30);

	Data.webdata.access.stories({
		culture: culture,
		limit: 4,
		order: '-createdAt',
		select: '_id title uniqueName imageId createdAt country lang'
	}).then(function(stories) {
		stories = stories.map(function(item) {
			return {
				id: item.id,
				url: 'http://' + config.host + links.story(item.uniqueName, item.id, {
					ul: culture.lang,
					utm_source: 'weather',
					utm_medium: 'widget',
					utm_campaign: 'weather_stories'
				}),
				imageSrc: links.wi('square', item.imageId),
				title: item.title,
				imageId: item.imageId,
				createdAt: item.createdAt
			};
		});
		res.json(stories);
	}).catch(function(error) {
		logger.error('Json weather stories', error);
		res.json([]);
	});
});
