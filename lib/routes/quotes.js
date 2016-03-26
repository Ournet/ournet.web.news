'use strict';

var express = require('express');
var utils = require('../utils');
var _ = utils._;
var Promise = utils.Promise;
var util = require('util');
/*eslint new-cap:1*/
var route = module.exports = express.Router();
var Data = require('../data');

//index

route.get('/:ul' + utils.localePrefix + '?/quotes', function(req, res, next) {
	var config = res.locals.config;
	var __ = res.locals.__;

	utils.maxageQuotes(res);

	var currentCulture = res.locals.currentCulture;
	var links = res.locals.links;

	var props = {
		quotes: Data.webdata.access.quotes({
			where: {
				country: currentCulture.country,
				lang: currentCulture.lang
			},
			select: '_id',
			limit: 10,
			order: '-createdAt'
		}).then(function(quotesIds) {
			return Data.quotes.access.quotes(_.pluck(quotesIds, 'id'), {
				sort: true
			});
		}),
		latestNews: Data.webdata.access.stories({
			culture: currentCulture,
			limit: 5,
			order: '-createdAt',
			select: '_id'
		}).then(function(storiesIds) {
			if (!storiesIds || storiesIds.length === 0) {
				return [];
			}
			return Data.stories.access.stories(_.pluck(storiesIds, 'id'), {
				params: {
					AttributesToGet: utils.storiesAttributes
				},
				sort: true
			});
		})
	};

	Promise.props(props).then(function(result) {
		res.locals.site.head.canonical = 'http://' + config.host + links.quotes({
			ul: currentCulture.language
		});

		res.locals.site.head.title = __('latest_quotes_in_media');
		res.locals.subTitle = util.format(__('latest_quotes_in_media_country_format'), currentCulture.countryName);

		res.render('quotes.jade', result);
	}).catch(next);
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

			res.locals.site.head.title = util.format('%s: "%s"', quote.author.name, utils.wrapAt(quote.text, 60));

			if (quote.category) {
				res.locals.category = Data.topics.categories.category(quote.category);
			}

			var props = {
				quotes: Data.quotes.access.quotesByAuthor(quote.authorId, {
					limit: 3
				}),
				stories: Data.webdata.access.stories({
					culture: currentCulture,
					limit: 3,
					order: '-createdAt',
					select: '_id'
				}).then(function(storiesIds) {
					if (!storiesIds || storiesIds.length === 0) {
						return [];
					}
					return Data.stories.access.stories(_.pluck(storiesIds, 'id'), {
						params: {
							AttributesToGet: utils.storiesAttributes
						},
						sort: true
					});
				})
			};

			return Promise.props(props).then(function(result) {
				res.locals.stories = result.stories;
				res.locals.quotes = result.quotes.filter(function(item) {
					return item.id !== id;
				});
				res.render('quote.jade');
			});
		}).catch(next);
});
