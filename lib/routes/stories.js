'use strict';

const express = require('express');
const utils = require('../utils');
/*eslint new-cap:1*/
const route = module.exports = express.Router();
const Data = require('../data');

//index

route.get('/:ul' + utils.localePrefix + '?/story/:uniqueName-:id(\\d+)', function (req, res, next) {
	const config = res.locals.config;
	const id = parseInt(req.params.id);

	utils.maxageStory(res);

	const culture = res.locals.currentCulture;
	const links = res.locals.links;

	if (req.query.ul === 'ru') {
		return res.redirect(301, links.news.story(req.params.uniqueName, id, {
			ul: req.query.ul
		}));
	}

	res.viewdata.story = ['story', { id: id }];
	res.viewdata.latestStories = ['newsStories', { country: culture.country, lang: culture.language, where: '', limit: 3, order: '-_id' }];
	res.viewdata.storyNews = ['storyWebpages', { country: culture.country, lang: culture.lang, where: JSON.stringify({ storyId: id }) }];
	// res.viewdata.storyQuotes = ['storyQuotes', { country: culture.country, lang: culture.lang, where: JSON.stringify({ storyId: id }) }];

	Data.get(res.viewdata).then(function (result) {
		const story = result.story;

		if (!story) {
			return res.redirect(links.news.home({
				ul: culture.lang
			}));
		}

		story.createdAt = new Date(story.createdAt);

		if (story.createdAt.getTime() > Date.now() - 1000 * 60 * 60 * 4) {
			utils.maxageFreshStory(res);
		}

		if (story.status === 'adult') {
			res.locals.noGoogleAds = true;
		}

		res.locals.hasVideo = story.videos && story.videos.length > 0;

		res.locals.site.head.canonical = config.protocol + '//' + config.host + links.news.story(story.slug, story.id, {
			ul: culture.language
		});

		res.locals.site.head.title = story.title;
		res.locals.site.head.description = utils.wrapAt(story.summary, 200);

		if (story.category) {
			res.locals.category = Data.categories.category(story.category);
		}

		if (story.quotes && story.quotes.length) {
			return Data.get({
				quotes: ['quotes', { ids: story.quotes }]
			}).then(function (result2) {
				res.locals.quotes = result2.quotes;
				res.render('story', result);
			});
		}

		if (result.storyNews) {
			result.storyNews.reverse();
			result.storyNews = utils._.uniqBy(result.storyNews, 'slug');
			const index = result.storyNews.findIndex(item => item.host === story.host && item.path === story.path);
			if (index > -1) {
				result.storyNews.splice(index, 1);
			}
		}

		res.render('story', result);

	}, next);
});
