var express = require('express'),
  utils = require('../utils.js'),
  route = module.exports = express.Router();

route.get('/favicon.ico', function(req, res, next) {
  var config = res.locals.config;
  utils.maxage(res, 60 * 24 * 14);
  return res.redirect(301, config.favicon);
});

route.get('/url', function(req, res) {
  var url = req.query.url;
  if (!url) return res.redirect('/');

  res.redirect('http://' + url);
});
