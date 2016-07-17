'use strict';

var data = require('ournet.data');
var News = require('ournet.data.news');
var Topics = require('entitizer.entities-storage');
var Stories = require('ournet.data.stories');
var Quotes = require('ournet.data.quotes');
var Videos = require('ournet.data.videos');
var cachify = require('transparentcache');

exports.common = data;

var news = exports.news = {
	access: News.getAccessService(),
	control: News.getControlService(),
	search: News.Search
};

var topics = exports.topics = {
	access: new Topics.AccessService(),
	util: Topics.utils,
	categories: Topics.categories,
	EntityName: Topics.EntityName
};

exports.stories = {
	access: new Stories.AccessService(),
	control: new Stories.ControlService(),
	search: Stories.Search
};

exports.quotes = {
	access: new Quotes.AccessService(),
	control: new Quotes.ControlService()
};

exports.videos = {
	access: new Videos.AccessService(),
	control: new Videos.ControlService()
};

// cachify topics
//

cachify(topics.access, {
	cachingStrategy: new cachify.strategies.RingBuffer({ size: 200 }),
	methods: { entityNameByKey: [0] }
});

cachify(topics.access, {
	cachingStrategy: new cachify.strategies.RingBuffer({ size: 200 }),
	methods: { entityById: [0] }
});

cachify(news.access, {
	cachingStrategy: new cachify.strategies.Timeout({ ttl: 1000 * 60 * 30 }),
	methods: { trendTopics: [0] }
});

// cachify common
//

cachify(data.widgets, {
	cachingStrategy: new cachify.strategies.Timeout({ ttl: 1000 * 60 * 10 }),
	methods: {
		getWeatherWidget: [0],
		getExchangeWidget: [0]
	}
});
