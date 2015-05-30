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
route.get('/:ul' + utils.localePrefix + '?/topic/:uniqueName', function(req, res, next) {
  var config = res.locals.config;
  var uniqueName = req.params.uniqueName.toLowerCase();

  utils.maxageTopic(res);

  var currentCulture = res.locals.currentCulture,
    currentDate = res.locals.currentDate,
    links = res.locals.links,
    __ = res.locals.__;

  var key = core.util.md5([currentCulture.country, currentCulture.lang, uniqueName].join('_'));

  Data.topics.access.topic({
    key: key,
    params: {
      AttributesToGet: ['id', 'key', 'uniqueName', 'country', 'lang', 'abbr', 'name', 'type', 'category', 'description']
    },
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
        if (!ids || ids.length === 0) return [];
        return Data.stories.access.stories({
          params: {
            AttributesToGet: utils.storiesAttributes
          },
          ids: ids,
          sort: true
        });
      }),
      latestNews: Data.webdata.access.webpages({
        culture: currentCulture,
        where: {
          'topics._id': topic.id
        },
        limit: 10,
        order: '-createdAt'
      })
    };
    if (topic.type === 1) {
      props.quotes = Data.quotes.access.quotesByAuthor({
        authorId: topic.id,
        limit: 3
      });
    } else {
      props.quotes = Data.quotes.access.quotesAbout({
        topicId: topic.id,
        limit: 3
      });
    }

    return Promise.props(props).then(function(result) {
      res.locals.stories = result.stories;
      res.locals.quotes = result.quotes;
      var storyMinDate = new Date();
      storyMinDate.setDate(storyMinDate.getDate() - 3);
      var newsMinDate = new Date();
      newsMinDate.setDate(newsMinDate.getDate() - 10);

      if (result.stories.length > 0 && new Date(result.stories[0].createdAt) > storyMinDate) {
        res.locals.mainStory = result.stories[0];
        result.stories.shift();
      } else if (result.latestNews.length > 0) {
        var index = _.findIndex(result.latestNews, function(item) {
          return item.imageId;
        });
        if (index > -1) {
          res.locals.mainItem = result.latestNews[index];
          result.latestNews.splice(index, 1);
        }
      }
      if (result.stories.length === 4) {
        result.stories.shift();
      }

      res.locals.oneList = {
        title: util.format(__('topic_latest_news'), topic.name),
        list: result.latestNews
      };

      res.render('topic.jade');
    });

  }).catch(function(error) {
    console.error(error);
    next(error);
  });
});

//topic stories
route.get('/:ul' + utils.localePrefix + '?/topic/:uniqueName/stories', function(req, res, next) {
  
  var config = res.locals.config;
  var uniqueName = req.params.uniqueName.toLowerCase();

  utils.maxageTopicStories(res);

  var currentCulture = res.locals.currentCulture,
    currentDate = res.locals.currentDate,
    links = res.locals.links,
    __ = res.locals.__;

  var key = core.util.md5([currentCulture.country, currentCulture.lang, uniqueName].join('_'));

  Data.topics.access.topic({
    key: key,
    params: {
      AttributesToGet: ['id', 'key', 'uniqueName', 'country', 'lang', 'abbr', 'name', 'type', 'category', 'description']
    },
  }).then(function(topic) {
    res.locals.topic = topic;
    if (!topic) {
      return res.redirect(links.home({
        ul: currentCulture.lang
      }));
    }

    res.locals.site.head.canonical = 'http://' + config.host + links.topicStories(topic.uniqueName, {
      ul: currentCulture.language
    });

    var name = (topic.abbr && topic.abbr !== topic.name ? (topic.name + ' (' + topic.abbr + ')') : topic.name);

    res.locals.site.head.title = util.format(__('page_topic_stories_title'), name);

    res.locals.shareInfo = ShareInfo({
      clientId: "topic-stories" + topic.id,
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
        limit: 10
      }).then(function(ids) {
        if (!ids || ids.length === 0) return [];
        return Data.stories.access.stories({
          params: {
            AttributesToGet: utils.storiesAttributes
          },
          ids: ids,
          sort: true
        });
      })
    };

    return Promise.props(props).then(function(result) {
      res.locals.stories = result.stories;
      res.render('topic_stories.jade');
    });

  }).catch(next);
});

//topic quotes
route.get('/:ul' + utils.localePrefix + '?/topic/:uniqueName/quotes', function(req, res, next) {
  var config = res.locals.config;
  var uniqueName = req.params.uniqueName.toLowerCase();

  utils.maxageTopicQuotes(res);

  var currentCulture = res.locals.currentCulture,
    currentDate = res.locals.currentDate,
    links = res.locals.links,
    __ = res.locals.__;

  var key = core.util.md5([currentCulture.country, currentCulture.lang, uniqueName].join('_'));

  Data.topics.access.topic({
    key: key,
    params: {
      AttributesToGet: ['id', 'key', 'uniqueName', 'country', 'lang', 'abbr', 'name', 'type', 'category', 'description']
    },
  }).then(function(topic) {
    res.locals.topic = topic;
    if (!topic) {
      return res.redirect(links.home({
        ul: currentCulture.lang
      }));
    }

    res.locals.site.head.canonical = 'http://' + config.host + links.topicQuotes(topic.uniqueName, {
      ul: currentCulture.language
    });

    var name = (topic.abbr && topic.abbr !== topic.name ? (topic.name + ' (' + topic.abbr + ')') : topic.name);

    res.locals.site.head.title = util.format(__('page_topic_quotes_title'), name);

    res.locals.shareInfo = ShareInfo({
      clientId: "topic-quotes" + topic.id,
      identifier: res.locals.site.head.canonical,
      url: res.locals.site.head.canonical,
      title: res.locals.site.head.title,
      summary: res.locals.site.head.description
    });

    if (topic.category) {
      res.locals.category = Data.topics.categories.category(topic.category);
    }

    var props = {};

    if (topic.type === 1) {
      props.quotes = Data.quotes.access.quotesByAuthor({
        authorId: topic.id,
        limit: 10
      });
    } else {
      props.quotes = Data.quotes.access.quotesAbout({
        topicId: topic.id,
        limit: 10
      });
    }

    return Promise.props(props).then(function(result) {
      res.locals.quotes = result.quotes;
      res.render('topic_quotes.jade');
    });

  }).catch(next);
});
