'use strict';

var express = require('express');
var core = require('ournet.core');
/*eslint new-cap:1*/
var route = module.exports = express.Router();
var utils = require('../utils.js');
var Data = require('../data.js');


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
					ul: culture.lang
				}),
				imageSrc: links.wi('square', item.imageId),
				title: item.title,
				imageId: item.imageId,
				createdAt: item.createdAt
			};
		});
		res.json(stories);
	}).catch(function(error) {
		core.logger.error('Json weather stories', error);
		res.json([]);
	});
});
