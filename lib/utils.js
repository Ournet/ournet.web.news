'use strict';

const utils = require('ournet.utils');
const _ = require('lodash');
const Promise = require('bluebird');
const moment = require('moment-timezone');
const crypto = require('crypto');
const t2p = require('text-to-paragraphs');
const inTextSearch = require('in-text-search');

exports.md5 = function md5(value) {
	return crypto.createHash('md5').update(value).digest('hex');
};

exports.storiesAttributes = ['id', 'title', 'summary', 'countViews', 'imageId', 'uniqueName', 'category', 'createdAt', 'host', 'path', 'videos', 'importantKey'];
exports.simpleStoriesAttributes = ['id', 'title', 'countViews', 'imageId', 'uniqueName', 'category', 'createdAt', 'host', 'path', 'videos', 'importantKey'];

exports.localePrefix = '(ru)';

const NO_CACHE = 'private, max-age=0, no-cache';
const PUBLIC_CACHE = 'public, max-age=';
const CACHE_CONTROL = 'Cache-Control';
/**
 * Set response Cache-Control
 * @age integet in minutes
 */
const maxage = exports.maxage = function(res, age) {
	if (process.env.NODE_ENV === 'development') {
		age = 0;
	}
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

exports.maxageActiveTopic = function(res) {
	maxage(res, 15);
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

exports.summaryToParagraphs = function(text) {
	if (text) {
		text = _.escape(text);
		return t2p(text, { nl2br: false });
	}
	return text;
};

exports.isNormalNewsTitle = function(title) {
	if (title.length < 50 || title.length > 100) {
		return false;
	}
	var countUpper = 0;
	for (var i = title.length - 1; i >= 0; i--) {
		if (title[i] === title[i].toUpperCase()) {
			countUpper++;
			if (countUpper / title.length > 0.2) {
				return false;
			}
		}
	}
	return true;
};

exports.inTextSearch = function(text, q) {
	return inTextSearch(text).search(q);
};

exports.compareTitles = function(title1, title2) {
	var text = title1;
	var q = title2;
	if (title2.length > title1.length) {
		text = title2;
		q = title1;
	}

	return exports.inTextSearch(text, q);
};

module.exports = exports = _.assign({
	_: _,
	Promise: Promise,
	moment: moment
}, exports, utils);
