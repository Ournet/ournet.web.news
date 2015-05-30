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

route.get('/:ul' + utils.localePrefix + '?/quote/:id', function(req, res, next) {
  var config = res.locals.config;
  var id = req.params.id;
  utils.maxageQuote(res);

  var currentCulture = res.locals.currentCulture,
    links = res.locals.links,
    __ = res.locals.__;

  Data.quotes.access.quote({
    id: id
  }).then(function(quote) {
    if (!quote) {
      return res.redirect(links.home({
        ul: currentCulture.lang
      }));
    }

    res.locals.quote = quote;

    res.locals.site.head.canonical = 'http://' + config.host + links.quote(quote.id, {
      ul: currentCulture.language
    });

    res.locals.site.head.title = util.format('%s: "%s"', quote.author.name, core.text.wrapAt(quote.text, 60));

    res.locals.shareInfo = ShareInfo({
      clientId: "quote-" + id,
      identifier: "quote-" + id,
      url: res.locals.site.head.canonical,
      title: res.locals.site.head.title,
      summary: res.locals.site.head.description
    });

    if (quote.category) {
      res.locals.category = Data.topics.categories.category(quote.category);
    }

    var props = {
      quotes: Data.quotes.access.quotesByAuthor({
        authorId: quote.authorId,
        limit: 3
      }),
      stories: Data.webdata.access.stories({
        culture: currentCulture,
        limit: 3,
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
      })
    };

    return Promise.props(props).then(function(result) {
      res.locals.stories = result.stories;
      res.locals.quotes = result.quotes.filter(function(item) {
        return item.id !== id;
      });
      res.render('quote.jade');
    });
  }).catch(next);
});
