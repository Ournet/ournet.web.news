'use strict';

var data = require('../data');
var access = data.topics.access;

exports.entityByKey = function(locals, params) {
	return access.entityByKey(params.key, params.options);
};
