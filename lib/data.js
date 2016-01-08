'use strict';

var Webdata = require('ournet.data.webdata');
var Topics = require('entitizer.entities-storage');
var Stories = require('ournet.data.stories');
var Quotes = require('ournet.data.quotes');
var Videos = require('ournet.data.videos');
var Websites = require('ournet.data.websites');

exports.topics = {
	access: new Topics.AccessService(),
	util: Topics.utils,
	categories: Topics.categories
};

exports.webdata = {
	access: Webdata.getCacheAccessService(),
	control: Webdata.getControlService(),
	search: Webdata.Search
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

exports.websites = {
	access: Websites.getAccessService()
};
