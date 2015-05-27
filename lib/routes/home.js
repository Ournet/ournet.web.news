var express = require('express'),
  core = require('ournet.core'),
  _ = core._,
  Promise = core.Promise,
  util = require('util'),
  utils = require('../utils.js'),
  route = module.exports = express.Router(),
  ShareInfo = require('../share_info.js'),
  Data = require('../data');

//index

route.get('/', function(req, res, next) {
  var config = res.locals.config;
  utils.maxageIndex(res);

  var currentCulture = res.locals.currentCulture,
    links = res.locals.links,
    __ = res.locals.__;

  res.locals.site.head.canonical = 'http://' + config.host + links.home({
    ul: currentCulture.language
  });

  res.locals.shareInfo = ShareInfo({
    clientId: "index",
    identifier: res.locals.site.head.canonical,
    url: res.locals.site.head.canonical,
    title: res.locals.site.head.title,
    summary: res.locals.site.head.description
  });

  var props = {
    stories: Data.webdata.access.stories(currentCulture, {
      limit: 5,
      order: '-createdAt',
      select: '_id'
    }).then(function(storiesIds) {
      if (!storiesIds || storiesIds.length === 0) return [];
      return Data.stories.access.stories({
        ids: _.pluck(storiesIds, 'id'),
        params: {
          AttributesToGet: utils.storiesAttributes
        },
        sort: true
      });
    }),
    latestNews: Data.webdata.access.webpages(currentCulture, {
      where: {
        imageId: {
          '$ne': null
        }
      },
      limit: 10,
      order: '-publishedAt'
    })
  };

  Promise.props(props).then(function(result) {
    //res.send(result);
    res.locals.mainStory = result.stories[0];
    res.locals.stories = result.stories.slice(1);
    res.locals.latestNews = result.latestNews;
    res.render('index.jade');
  }).catch(next);
});

route.get('/:category(politics|business|entertainment|sports|tech|science|live|arts|justice)', function(req, res, next) {
  var config = res.locals.config;
  utils.maxageIndex(res);

  var currentCulture = res.locals.currentCulture,
    links = res.locals.links,
    __ = res.locals.__;

  var category = res.locals.category = Data.topics.categories.category(req.params.category);

  res.locals.site.head.canonical = 'http://' + config.host + links.home({
    ul: currentCulture.language
  });

  res.locals.shareInfo = ShareInfo({
    clientId: "index",
    identifier: res.locals.site.head.canonical,
    url: res.locals.site.head.canonical,
    title: res.locals.site.head.title,
    summary: res.locals.site.head.description
  });

  var props = {
    stories: Data.webdata.access.stories(currentCulture, {
      where: {
        category: category.id
      },
      limit: 5,
      order: '-createdAt',
      select: '_id'
    }).then(function(storiesIds) {
      if (!storiesIds || storiesIds.length === 0) return [];
      return Data.stories.access.stories({
        ids: _.pluck(storiesIds, 'id'),
        params: {
          AttributesToGet: ['id', 'title', 'summary', 'countViews', 'imageId', 'uniqueName', 'category', 'createdAt']
        },
        sort: true
      });
    }),
    latestNews: Data.webdata.access.webpages(currentCulture, {
      where: {
        category: category.id,
        imageId: {
          $ne: null
        }
      },
      limit: 10,
      order: '-publishedAt'
    })
  };

  Promise.props(props).then(function(result) {
    //res.send(result);
    res.locals.mainStory = result.stories[0];
    res.locals.stories = result.stories.slice(1);
    res.locals.latestNews = result.latestNews;
    res.render('index.jade');
  }).catch(next);
});
