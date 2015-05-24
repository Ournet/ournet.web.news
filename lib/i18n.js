var i18n = require('i18n'),
  moment = require('moment'),
  core = require('ournet.core');

i18n.configure({
  // setup some locales - other locales default to en silently
  locales: ['en', 'ro', 'ru', 'hu', 'cs', 'bg', 'it', 'pl'],

  // where to store json files - defaults to './locales' relative to modules directory
  directory: __dirname + '/locales',

  //defaultLocale: config.language,

  // sets a custom cookie name to parse locale settings from  - defaults to NULL
  //cookie: 'lang',
});

module.exports = function(req, res, next) {
  var config = res.locals.config;
  var locale;
  if (req.query.ul && config.languages.indexOf(req.query.ul) > -1)
    locale = req.query.ul;
  else locale = config.language;
  res.locals.locale = res.locale = locale;
  //i18n.setLocale(req, locale);
  i18n.init(req, res);
  res.setLocale(locale);

  return next();
};
