'use strict';

var News = require('ournet.data.news');
var Topics = require('entitizer.entities-storage');
var Stories = require('ournet.data.stories');
var Quotes = require('ournet.data.quotes');
var Videos = require('ournet.data.videos');

var news = {
	access: News.getCacheAccessService(),
	control: News.getControlService(),
	search: News.Search
};

exports.topics = {
	access: new Topics.AccessService(),
	util: Topics.utils,
	categories: Topics.categories,
	EntityName: Topics.EntityName
};

exports.webdata = news;

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

exports.websites = {
	access: news.access
};
