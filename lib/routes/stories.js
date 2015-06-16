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

route.get('/:ul' + utils.localePrefix + '?/story/:uniqueName-:id(\\d+)', function(req, res, next) {
  var config = res.locals.config;
  var id = parseInt(req.params.id);
  utils.maxageStory(res);

  var currentCulture = res.locals.currentCulture,
    links = res.locals.links,
    __ = res.locals.__;

  if (req.query.ul === 'ru') {
    return res.redirect(301, links.story(req.params.uniqueName, id, {
      ul: req.query.ul
    }));
  }


  var relatedNewsWhere = {
    _id: {
      $ne: id
    }
  };

  Data.stories.access.story({
    id: id
  }).then(function(story) {
    if (!story) {
      return res.redirect(links.home({
        ul: currentCulture.lang
      }));
    }

    res.locals.story = story;

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

    if (story.category) {
      res.locals.category = Data.topics.categories.category(story.category);
      relatedNewsWhere.category = story.category;
    }

    var props = {
      relatedNews: Data.webdata.access.stories({
        culture: currentCulture,
        where: relatedNewsWhere,
        limit: 3,
        order: '-createdAt'
      })
    };
    if (story.countNews > 4 && story.topics && story.topics.length > 0) {
      props.news = Data.webdata.access.webpages({
        culture: currentCulture,
        where: {
          'topics._id': story.topics[0].id,
          'imageId': {
            $ne: null
          }
        },
        limit: 3,
        order: '-createdAt'
      });
    }

    if (story.quotes && story.quotes.length > 0) {
      props.quotes = Data.quotes.access.quotes({
        ids: story.quotes
      });
    }

    return Promise.props(props).then(function(result) {
      res.locals.news = result.news;
      res.locals.relatedNews = result.relatedNews;
      res.locals.quotes = result.quotes;
      res.render('story.jade');
    });
  }).catch(next);
});
