'use strict';

var data = require('../data');

exports.quotes = function(locals, params) {
	return data.quotes.access.quotes(params.ids, params.options);
};

exports.quote = function(locals, params) {
	return data.quotes.access.quote(params.id, params.options);
};

exports.quotesByAuthor = function(locals, params) {
	return data.quotes.access.quotesByAuthor(params.authorId, params.options);
};

exports.quotesAbout = function(locals, params) {
	return data.quotes.access.quotesAbout(params.topicId, params.options);
};
