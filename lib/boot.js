'use strict';

const config = require('./config');
const path = require('path');
const Links = require('ournet.links');

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
	// return ['md', 'ro', 'ru', 'bg', 'hu', 'pl', 'in', 'cz'][getRandomInt(0, 6)];
	return hosts[req.hostname] || process.env.COUNTRY;
}

const links = {};

function getLinks(country, language) {
	if (!links[country]) {
		links[country] = Links.country(country, language);
	}
	return links[country];
}

module.exports = function(req, res, next) {
	const country = getCountry(req);
	if (!country) {
		return next(new Error('Invalid hostname', {
			hostname: req.hostname
		}));
	}
	const conf = config(country);
	res.locals.config = conf;
	res.locals.links = getLinks(conf.country, conf.language);
	res.locals.Links = Links;
	next();
};
