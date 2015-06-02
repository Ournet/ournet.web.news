var extern = module.exports,
  core = require('ournet.core');

extern.storiesAttributes = ['id', 'title', 'summary', 'countViews', 'imageId', 'uniqueName', 'category', 'createdAt', 'host', 'path', 'videos'];

extern.localePrefix = '(ru)';

var NO_CACHE = 'private, max-age=0, no-cache';
var PUBLIC_CACHE = 'public, max-age=';
var CACHE_CONTROL = 'Cache-Control';
/**
 * Set response Cache-Control
 * @maxage integet in minutes
 */
extern.maxage = function(res, maxage) {
  //maxage = 0;
  var cache = NO_CACHE;
  if (maxage > 0) {
    cache = PUBLIC_CACHE + (maxage * 60);
  }
  res.set(CACHE_CONTROL, cache);
};

extern.maxageRedirect = function(res) {
  extern.maxage(res, 60 * 12);
};

extern.maxageStory = function(res) {
  extern.maxage(res, 60 * 2);
};

extern.maxageQuote = function(res) {
  extern.maxage(res, 60 * 2);
};

extern.maxageItem = function(res) {
  extern.maxage(res, 60 * 12);
};

extern.maxageTopic = function(res) {
  extern.maxage(res, 30);
};

extern.maxageTopicStories = function(res) {
  extern.maxage(res, 60 * 2);
};

extern.maxageTopicQuotes = function(res) {
  extern.maxage(res, 60 * 6);
};

extern.maxageIndex = function(res) {
  extern.maxage(res, 10);
};

extern.maxageSearch = function(res) {
  extern.maxage(res, 60 * 2);
};
