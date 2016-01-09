'use strict';

exports.storiesAttributes = ['id', 'title', 'summary', 'countViews', 'imageId', 'uniqueName', 'category', 'createdAt', 'host', 'path', 'videos'];

exports.localePrefix = '(ru)';

var NO_CACHE = 'private, max-age=0, no-cache';
var PUBLIC_CACHE = 'public, max-age=';
var CACHE_CONTROL = 'Cache-Control';
/**
 * Set response Cache-Control
 * @age integet in minutes
 */
var maxage = exports.maxage = function(res, age) {
	//age = 0;
	var cache = NO_CACHE;
	if (age > 0) {
		cache = PUBLIC_CACHE + (age * 60);
	}
	res.set(CACHE_CONTROL, cache);
};

exports.maxageRedirect = function(res) {
	maxage(res, 60 * 12);
};

exports.maxageSources = function(res) {
	maxage(res, 60 * 12);
};

exports.maxageSource = function(res) {
	maxage(res, 20);
};

exports.maxageStory = function(res) {
	maxage(res, 60 * 2);
};

exports.maxageQuote = function(res) {
	maxage(res, 60 * 2);
};

exports.maxageQuotes = function(res) {
	maxage(res, 60 * 2);
};

exports.maxageItem = function(res) {
	maxage(res, 60 * 12);
};

exports.maxageTopic = function(res) {
	maxage(res, 30);
};

exports.maxageTopicStories = function(res) {
	maxage(res, 60 * 2);
};

exports.maxageTopicQuotes = function(res) {
	maxage(res, 60 * 6);
};

exports.maxageIndex = function(res) {
	maxage(res, 10);
};

exports.maxageSearch = function(res) {
	maxage(res, 60 * 2);
};

exports.maxageVideoFrame = function(res) {
	maxage(res, 60 * 6);
};
