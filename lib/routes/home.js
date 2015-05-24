var express = require('express'),
  core = require('ournet.core'),
  util = require('util'),
  utils = require('../utils.js'),
  route = express.Router(),

  ShareInfo = require('../share_info.js'),
  places = require('ournet.data.places'),
  weather = require('ournet.data.weather');

//index

route.get('/', function(req, res, next) {
  var config = res.locals.config;
  utils.maxageIndex(res);

  var currentCulture = res.locals.currentCulture,
    links = res.locals.links,
    __ = res.locals.__;

  res.locals.location.pop();

  res.locals.title = res.locals.site.head.title = util.format(__('home_title_format'), places.util.inCountryName(currentCulture.countryName, currentCulture.language));
  res.locals.subTitle = res.locals.site.head.description = util.format(__('weather_in_cn_summary'), places.util.inCountryName(currentCulture.countryName, currentCulture.language));
  res.locals.site.head.keywords = util.format("{0}, {1}, {2}", __('weather'), __('weather2'), currentCulture.countryName);

  res.locals.site.head.canonical = 'http://' + config.host + links.home();

  res.locals.shareInfo = ShareInfo({
    clientId: "index",
    identifier: res.locals.site.head.canonical,
    url: res.locals.site.head.canonical,
    title: res.locals.site.head.title,
    summary: res.locals.site.head.description
  });

  var date = core.util.formatDate(new Date());
  places.CacheAccessService.instance.getPlaces({
    ids: config.mainPlaces,
    getRegion: true
  }).then(function(places) {
    weather.CacheAccessService.instance.getPlacesForecast({
      country_code: config.country,
      date: date,
      places: places
    }).then(function(result) {
      return res.render('index', {
        placesWeather: result
      });
    });
  }).catch(next);
});

exports = module.exports = route;
