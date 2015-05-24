var core = require('ournet.core'),
  md5 = core.util.md5,
  Promise = core.Promise,
  utils = require('../utils.js');

module.exports = function(req, res, next) {
  var config = res.locals.config;
  var lang = res.locals.currentCulture.language;
  res.locals.location = [{
    href: res.locals.links.home({
      ul: lang
    }),
    text: res.locals.__('home')
  }];

  utils.maxage(res, 60 * 4);

  var props = {
    // places: places.CacheAccessService.instance.getPlaces({
    //   ids: config.mainPlaces,
    //   getRegion: true,
    //   sort: true
    // })
  };
  if (config.projects.news) {
    //props.stories = newsService.getStories(config, lang);
  }

  Promise.props(props).then(function(result) {
    //res.locals.stories = result.stories;
    //res.locals.mainPlaces = result.places || [];
  }).error(function(error) {
    core.logger.error('news:' + (error && error.message), error);
  }).finally(next);
};
