'use strict';

const express = require('express');
const utils = require('../utils');
const util = require('util');
/*eslint new-cap:1*/
const route = module.exports = express.Router();
const Data = require('../data');

//index

route.get('/:ul' + utils.localePrefix + '?/quotes', function(req, res, next) {
	const config = res.locals.config;
	const __ = res.locals.__;

	utils.maxageQuotes(res);

	const culture = res.locals.currentCulture;
	const links = res.locals.links;

	res.locals.selectedMenuType = 'quotes';

	res.locals.site.head.canonical = config.protocol + '//' + links.news.host + links.news.quotes({
		ul: culture.language
	});

	res.locals.site.head.title = __('latest_quotes_in_media');
	res.locals.subTitle = util.format(__('latest_quotes_in_media_country_format'), culture.countryName);


	res.viewdata.quotes = ['newsQuotes', { where: JSON.stringify({ country: culture.country, lang: culture.language }), limit: 18, order: '-createdAt' }];
	res.viewdata.latestNews = ['newsStories', { country: culture.country, lang: culture.language, where: '', limit: 3, order: '-_id' }];

	Data.get(res.viewdata).then(function(result) {
		return res.render('quotes', result);
	}, next);
});

route.get('/:ul' + utils.localePrefix + '?/quote/:id', function(req, res, next) {
	const config = res.locals.config;
	const id = req.params.id;

	utils.maxageQuote(res);

	const culture = res.locals.currentCulture;
	const links = res.locals.links;


	res.locals.site.head.canonical = config.protocol + '//' + config.host + links.news.quote(id, {
		ul: culture.language
	});

	res.locals.selectedMenuType = 'quotes';

	res.viewdata.quote = ['quote', { id: id }];
	res.viewdata.latestStories = ['newsStories', { country: culture.country, lang: culture.language, where: '', limit: 3, order: '-_id' }];

	Data.get(res.viewdata).then(function(result) {
		const quote = result.quote;

		if (!quote) {
			return res.redirect(links.news.home({
				ul: culture.lang
			}));
		}

		res.locals.site.head.title = util.format('%s: "%s"', quote.author.name, utils.wrapAt(quote.text, 80));
		res.locals.site.head.description = util.format('%s: "%s"', quote.author.name, utils.wrapAt(quote.text, 180));

		return Data.get({
			quotes: ['quotesByAuthorId', { authorId: parseInt(quote.author.id), limit: 4 }]
		}).then(function(result2) {
			result.quotes = result2.quotes;
			result.quotes = result.quotes.filter(q => q.id !== id);
			res.render('quote', result);
		});
	}, next);
});
