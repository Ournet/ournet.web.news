var express = require('express'),
  core = require('ournet.core'),
  _ = core._,
  route = module.exports = express.Router(),
  places = require('ournet.data.places'),
  weather = require('ournet.data.weather'),
  utils = require('../utils.js'),
  util = require('util'),
  internal = {};


route.get('/json/today/:id.json', function(req, res, next) {
  var config = res.locals.config;
  
  utils.maxagePlace(res);

  var date = new Date(),
    id = parseInt(req.params.id),
    links = res.locals.links,
    lang = res.locals.currentCulture.language,
    __ = res.locals.__;

  internal.getPlace(id).then(function(place) {
    if (!place) {
      core.logger.error('Not found place', {
        placeid: id,
        url: req.originalUrl
      });
      return res.send(null);
    }
    return internal.getWeather(place).then(function(report) {
      if (!report || !report.days) return res.send(null);

      var day = _.find(report.days, {
        date: core.util.formatDate(date)
      });

      if (!day) return res.send(null);

      var time = day.times[parseInt(day.times.length / 2)];

      res.send({
        place: {
          name: place.getName(lang),
          title: util.format(__('weather_in_format'), places.util.inPlaceName(place, lang)),
          id: place.id,
          url: 'http://' + config.host + links.weather.place(place.id, {
            ul: lang
          })
        },
        forecast: {
          temperature: time.t.value,
          symbol: {
            id: time.symbol.number,
            name: weather.util.symbolName(time.symbol, lang)
          }
        }
      });
    });
  }).catch(next);
});

internal.getPlace = function(id) {
  return places.CacheAccessService.instance.getPlace({
    id: id,
    getRegion: true
  });
};

internal.getWeather = function(place) {
  return weather.CacheAccessService.instance.getForecast(weather.forecast.formatSelector(place));
};
