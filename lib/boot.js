var config = require('./config'),
  urlset = require('urlset');

module.exports = function(req, res, next) {
  var country = getCountry(req);
  if (!country) {
    return next(new Error('Invalid hostname', {
      hostname: req.hostname
    }));
  }
  var conf = config(country);
  res.locals.config = conf;
  res.locals.links = getLinks(conf.country, conf.language);
  next();
};

var hosts = {
  'news.click.md': 'md',
  'news.ournet.ro': 'ro',
  'news.zborg.ru': 'ru',
  'news.ournet.bg': 'bg',
  'news.ournet.hu': 'hu',
  'news.diez.pl': 'pl',
  'news.ournet.in': 'in',
  'news.ournet.cz': 'cz',
  'news.ournet.it': 'it'
};

function getCountry(req) {
  return hosts[req.hostname] || process.env.COUNTRY;
}

var links = {};

function getLinks(country, language) {
  if (!links[country]) {
    var l = new urlset.Provider({
      params: []
    });
    l.load(__dirname + '/sitemap.json');
    l.setParam({
      name: 'ul',
      value: language,
      format: 's'
    });
    links[country] = l.url;
  }
  return links[country];
}
