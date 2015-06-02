var _package = require('../../package.json'),
  i18n = require('i18n'),
  core = require('ournet.core'),
  Promise = core.Promise,
  utils = require('../utils.js'),
  util = {
    moment: require('moment'),
    format: require('util').format,
    startWithUpperCase: core.util.startWithUpperCase,
    numberFormat: core.util.numberFormat,
    wrapAt: core.text.wrapAt,
    crypto: core.crypto,
    date: core.date,
    htmlText: function(text) {
      if (!text) return text;
      return text.trim().replace(/\n/g, '<br/>')
    },
    toUrl: function(item) {
      return '/url?url=' + encodeURIComponent(item.host + item.path);
    }
  },
  data = require('ournet.data');
var Data = require('../data');

module.exports = function(req, res, next) {
  var config = res.locals.config;
  var culture = res.locals.currentCulture = {
    language: res.locale,
    lang: res.locale,
    country: config.country
  };
  culture.languageName = res.locals.__('language_' + culture.language);
  culture.countryName = res.locals.__('country_' + culture.country);

  //console.log(culture.language);

  res.locals.currentDate = core.date(config.timezone);
  res.locals.currentDateNoTime = core.date(config.timezone);
  res.locals.currentDateNoTime.setHours(0, 0, 0, 0);

  //console.log(currentDate)

  res.locals.site = {
    name: config.name,
    head: {}
  };

  res.locals.config = config;

  res.locals.project = {
    version: _package.version,
    name: 'news',
    portalsAbroad: []
  };

  //res.locals.noGoogleAds = true;

  res.locals.util = util;

  res.locals.topBarMenu = [];
  res.locals.showTopPageBar = true;

  res.locals.categories = Data.topics.categories.all();

  for (var project in config.projects) {
    var host = config.projects[project];
    var item = {
      id: project,
      text: res.locals.__(project),
      href: 'http://' + host + res.locals.links.home({
        ul: culture.language
      })
    };
    if (host === config.host)
      item.cssClass = 'active';
    res.locals.topBarMenu.push(item);
  }

  res.locals._events = [];

  utils.maxage(res, 60);

  var props = {
    weather: data.widgets.getWeatherWidget({
      country: culture.country,
      lang: culture.language
    }),
    trendingTopics: Data.webdata.access.trendTopics({
      where: {
        country: culture.country,
        lang: culture.lang
      },
      limit: 10,
      order: '-counts.trend24h'
    })
  };
  if (config.projects.exchange) {
    props.exchange = data.widgets.getExchangeWidget({
      country: culture.country,
      lang: culture.language
    });
  }

  Promise.props(props).then(function(result) {
    res.locals.exchangeWidget = result.exchange;
    res.locals.weatherWidget = result.weather;
    res.locals.trendingTopics = result.trendingTopics;
  }).finally(next);
};
