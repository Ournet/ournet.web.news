'use strict';

var data = require('../data');
var utils = require('../utils');
var _ = utils._;

exports.trendingTopics = function(locals, params) {
	return data.news.access.trendTopics(params);
};

exports.newsStories = function(locals, params) {
	return data.news.access.stories(params);
};

exports.newsQuotes = function(locals, params) {
	return data.news.access.quotes(params);
};

exports.webpage = function(locals, params) {
	return data.news.access.webpage(params);
};

exports.webpages = function(locals, params) {
	return data.news.access.webpages(params);
};

exports.feeds = function(locals, params) {
	return data.news.access.feeds(params);
};

exports.websites = function(locals, params) {
	return data.news.access.websites(params);
};

exports.website = function(locals, params) {
	return data.news.access.website(params);
};

exports.newsSources = function(locals, params) {
	return data.news.access.feeds(params)
		.then(function(feeds) {
			return data.news.access.websites({
				where: {
					_id: {
						$in: _.uniq(_.pluck(feeds, 'websiteId'))
					}
				},
				select: 'host title',
				order: 'host',
				limit: 100
			});
		});
};

exports.storiesNews = function(locals, params) {
	return data.news.access.stories(params)
		.then(function(storiesIds) {
			if (!storiesIds || storiesIds.length === 0) {
				return [];
			}
			return data.stories.access.stories(_.pluck(storiesIds, 'id'), {
				params: {
					AttributesToGet: utils.storiesAttributes
				},
				sort: true
			});
		});
};

exports.quotesNews = function(locals, params) {
	return data.news.access.quotes(params)
		.then(function(quotesIds) {
			if (quotesIds && quotesIds.length > 0) {
				return data.quotes.access.quotes(_.pluck(quotesIds, 'id'), {
					sort: true
				});
			}
			return [];
		});
};
