var express = require('express'),
  core = require('ournet.core'),
  _ = core._,
  Promise = core.Promise,
  util = require('util'),
  utils = require('../utils.js'),
  route = module.exports = express.Router(),
  ShareInfo = require('../share_info.js'),
  Data = require('../data');

//topic
route.get('/topic/:uniqueName', function(req, res, next) {
  var config = res.locals.config;
  var uniqueName = req.params.uniqueName.toLowerCase();

  utils.maxageTopic(res);

  var currentCulture = res.locals.currentCulture,
    links = res.locals.links,
    __ = res.locals.__;

  var key = core.util.md5([currentCulture.country, currentCulture.lang, uniqueName].join('_'));

  Data.topics.access.topic({
    key: key
  }).then(function(topic) {
    res.locals.topic = topic;
    if (!topic) {
      return res.redirect(links.home({
        ul: currentCulture.lang
      }));
    }

    res.locals.site.head.canonical = 'http://' + config.host + links.topic(topic.uniqueName, {
      ul: currentCulture.language
    });

    var name = (topic.abbr && topic.abbr !== topic.name ? (topic.name + ' (' + topic.abbr + ')') : topic.name);

    res.locals.site.head.title = util.format(__('page_topic_title'), name);
    res.locals.site.head.description = util.format(__('topic_description'), name);
    res.locals.site.head.keywords = [topic.name, __('news'), __('stories'), currentCulture.countryName].join(', ');

    res.locals.subtitle = res.locals.site.head.description;
    res.locals.title = util.format(__('topic_title'), topic.abbr || topic.name);

    res.locals.shareInfo = ShareInfo({
      clientId: "topic" + topic.id,
      identifier: res.locals.site.head.canonical,
      url: res.locals.site.head.canonical,
      title: res.locals.site.head.title,
      summary: res.locals.site.head.description
    });

    if (topic.category) {
      res.locals.category = Data.topics.categories.category(topic.category);
    }

    var props = {
      stories: Data.stories.access.topicStoriesIds({
        topicId: topic.id,
        limit: 4
      }).then(function(ids) {
        return Data.stories.access.stories({
          ids: ids,
          sort: true
        });
      }),
      latestNews: Data.webdata.access.webpages(currentCulture, {
        where: {
          'topics.id': topic.id
        },
        limit: 10,
        order: '-createdAt'
      })
    };

    return Promise.props(props).then(function(result) {
      res.locals.stories = result.stories;
      res.locals.latestNews = result.latestNews;
      res.render('topic.jade');
    });

  }).catch(next);
});
