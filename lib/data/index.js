'use strict';

// const debug = require('debug')('ournet-news:data');
let signsNames;
const signsNamesBySlug = {};
const logger = require('../logger');
const Data = require('ournet.web.data');

exports.weather = require('./weather');
exports.Place = require('./place');
exports.categories = require('./categories');

Data.initProperties(require('./properties'));

exports.init = function() {
	return exports.get({ signsNames: ['horoscopeSignsNames'] })
		.then(function(reslut) {
			signsNames = reslut.signsNames;

			Object.keys(signsNames).forEach(id => {
				const signName = signsNames[id];
				// console.log('signName', signName);
				Object.keys(signName).forEach(lang => {
					signsNamesBySlug[lang] = signsNamesBySlug[lang] || {};
					signsNamesBySlug[lang][signName[lang].slug] = signName[lang];
					signsNamesBySlug[lang][signName[lang].slug].id = id;
				});
			});

			// console.log(signsNamesBySlug);
		});
};

// {place:['place',{placeForecast:1002}]}
exports.get = function(data) {
	return Data.get(data).then(function(result) {
		if (result.errors) {
			logger.error('Error on getting data', result.errors);
		}

		return result;
	});
};

exports.signsNames = function() {
	return signsNames;
};

exports.signName = function(id, lang) {
	return signsNames[id][lang];
};

exports.signNameBySlug = function(lang, slug) {
	return signsNamesBySlug[lang][slug];
};
