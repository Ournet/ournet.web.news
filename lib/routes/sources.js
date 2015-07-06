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

route.get('/:ul' + utils.localePrefix + '?/sources', function(req, res, next) {
  var config = res.locals.config;
  utils.maxageSources(res);

  var currentCulture = res.locals.currentCulture,
    links = res.locals.links,
    __ = res.locals.__;

  res.locals.site.head.canonical = 'http://' + config.host + links.sources({
    ul: currentCulture.language
  });

  res.locals.title = res.locals.site.head.title = __('news_sources') + ': ' + currentCulture.countryName;

  res.locals.shareInfo = ShareInfo({
    clientId: "sources-" + currentCulture.lang,
    identifier: res.locals.site.head.canonical,
    url: res.locals.site.head.canonical,
    title: res.locals.site.head.title
  });

  Data.websites.access.feeds({
      where: {
        country: currentCulture.country,
        lang: currentCulture.lang,
        status: 'active'
      },
      select: 'websiteId',
      limit: 100
    })
    .then(function(feeds) {
      return Data.websites.access.websites({
        where: {
          _id: {
            $in: _.uniq(_.pluck(feeds, 'websiteId'))
          }
        },
        select: 'host title',
        order: 'host',
        limit: 100
      }).then(function(websites) {
        res.locals.sources = websites;
        res.render('sources.jade');
      });
    })
    .catch(next);
});

route.get('/:ul' + utils.localePrefix + '?/source/:host', function(req, res, next) {
  var config = res.locals.config;
  var host = req.params.host.toLowerCase();
  utils.maxageSource(res);

  var currentCulture = res.locals.currentCulture,
    links = res.locals.links,
    __ = res.locals.__;

  res.locals.site.head.canonical = 'http://' + config.host + links.source(host, {
    ul: currentCulture.language
  });
  res.locals.title = res.locals.site.head.title = core.util.startWithUpperCase(host) + ': ' + __('latest_news');

  Data.websites.access.website({
      host: host
    })
    .then(function(website) {
      if (!website) {
        core.logger.error('Not found website: ' + host);
        return res.redirect(links.home({
          ul: currentCulture.language
        }));
      }
      res.locals.shareInfo = ShareInfo({
        clientId: "source-" + website.id,
        identifier: res.locals.site.head.canonical,
        url: res.locals.site.head.canonical,
        title: res.locals.site.head.title
      });

      return Data.webdata.access.webpages({
        culture: currentCulture,
        where: {
          websiteId: website.id
        },
        order: '-createdAt',
        limit: 20
      }).then(function(news) {
        res.locals.news = news;
        res.render('source.jade');
      });
    })
    .catch(next);
});
