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

route.get('/story/:uniqueName-:id(\\d+)', function(req, res, next) {
  var config = res.locals.config;
  var id = parseInt(req.params.id);
  var story;
  utils.maxageStory(res);

  var currentCulture = res.locals.currentCulture,
    links = res.locals.links,
    __ = res.locals.__;


  var relatedNewsWhere = {
    _id: {
      $ne: id
    }
  };

  var props = {
    story: Data.stories.access.story({
      id: id
    }),
    relatedNews: Data.webdata.access.stories(currentCulture, {
      where: relatedNewsWhere,
      limit: 3,
      order: '-createdAt'
    })
  };

  Promise.props(props).then(function(result) {
    story = result.story;
    res.locals.site.head.canonical = 'http://' + config.host + links.story(story.uniqueName, story.id, {
      ul: currentCulture.language
    });

    res.locals.site.head.title = story.title;
    res.locals.site.head.description = core.text.wrapAt(story.summary, 200);

    res.locals.shareInfo = ShareInfo({
      clientId: "index",
      identifier: res.locals.site.head.canonical,
      url: res.locals.site.head.canonical,
      title: res.locals.site.head.title,
      summary: res.locals.site.head.description
    });
    res.locals.story = result.story;
    res.locals.relatedNews = result.relatedNews;
    res.render('story.jade');
  }).catch(next);
});
