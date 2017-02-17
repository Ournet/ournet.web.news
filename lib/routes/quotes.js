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
		console.log(result.errors);
		return res.render('quotes', result);
	}, next);
});

route.get('/:ul' + utils.localePrefix + '?/quote/:id', function(req, res, next) {
	var config = res.locals.config;
	var id = req.params.id;

	utils.maxageQuote(res);

	var currentCulture = res.locals.currentCulture;
	var links = res.locals.links;

	Data.quotes.access.quote(id)
		.then(function(quote) {
			if (!quote) {
				return res.redirect(links.home({
					ul: currentCulture.lang
				}));
			}

			res.locals.quote = quote;

			res.locals.site.head.canonical = 'http://' + config.host + links.quote(quote.id, {
				ul: currentCulture.language
			});

			res.locals.site.head.title = util.format('%s: "%s"', quote.author.name, utils.wrapAt(quote.text, 80));
			res.locals.site.head.description = util.format('%s: "%s"', quote.author.name, utils.wrapAt(quote.text, 180));

			res.locals.selectedMenuType = 'quotes';

			// if (quote.category) {
			// 	res.locals.category = Data.topics.categories.category(quote.category);
			// }

			res.viewdata.set({
				quotes: {
					source: 'quotesByAuthor',
					params: {
						authorId: quote.authorId,
						options: {
							limit: 3
						}
					}
				},
				latestStories: {
					source: 'storiesNews',
					params: {
						culture: currentCulture,
						limit: 3,
						order: '-createdAt',
						select: '_id'
					}
				}
			});

			res.viewdata.get(res.locals, function(error) {
				if (error) {
					return next(error);
				}
				res.locals.quotes = res.locals.quotes.filter(function(item) {
					return item.id !== id;
				});
				res.render('quote');
			});
		}, next);
});
