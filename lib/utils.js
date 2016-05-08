'use strict';

var utils = require('ournet.utils');
var _ = require('lodash');
var Promise = require('bluebird');
var moment = require('moment-timezone');
var crypto = require('crypto');

exports.md5 = function md5(value) {
	return crypto.createHash('md5').update(value).digest('hex');
};

exports.storiesAttributes = ['id', 'title', 'summary', 'countViews', 'imageId', 'uniqueName', 'category', 'createdAt', 'host', 'path', 'videos', 'importantKey'];
exports.simpleStoriesAttributes = ['id', 'title', 'countViews', 'imageId', 'uniqueName', 'category', 'createdAt', 'host', 'path', 'videos', 'importantKey'];

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

exports.getPlatform = function getPlatform(req) {
	var name = 'desktop';
	if (req.headers['cloudfront-is-mobile-viewer'] === 'true') {
		name = 'mobile';
	}
	// name = 'mobile';
	return name;
};

exports.getRenderName = function(req, name) {
	if (req.locals.site.platform === 'mobile') {
		name += '_mobile';
	}
	return name;
};

exports.startWithUpperCase = function(text) {
	if (text && text.length > 0) {
		return text[0].toUpperCase() + text.substr(1);
	}
	return text;
};

exports.wrapAt = function(text, length) {
	if (text && text.length > length) {
		return text.substr(0, length - 3) + '...';
	}
	return text;
};

exports.tz = function(timezone, t) {
	t = t || Date.now();
	return moment.tz(t, timezone);
};

module.exports = exports = _.assign({
	_: _,
	Promise: Promise,
	moment: moment
}, exports, utils);
