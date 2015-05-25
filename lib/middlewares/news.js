var core = require('ournet.core'),
  md5 = core.util.md5,
  Promise = core.Promise,
  utils = require('../utils.js');

module.exports = function(req, res, next) {
  // var config = res.locals.config;
  // var currentCulture = res.locals.currentCulture;
  // var lang = currentCulture.language;

  next();
};
