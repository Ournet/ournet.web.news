'use strict';

var data = require('../data');
var utils = require('../utils');

exports.story = function(locals, params) {
	return data.stories.access.story(params.id, params.options);
};

exports.stories = function(locals, params) {
	return data.stories.access.stories(params.ids, params.options);
};

exports.importantStories = function(locals, params) {
	return data.stories.access.importantStoriesIds(params.key, params.options)
		.then(function(storiesIds) {
			if (!storiesIds || storiesIds.length === 0) {
				return [];
			}
			return data.stories.access.stories(storiesIds, {
				params: {
					AttributesToGet: utils.storiesAttributes
				},
				sort: true
			});
		});
};

exports.topicStories = function(locals, params) {
	return data.stories.access.topicStoriesIds(params.topicId, params.options)
		.then(function(ids) {
			if (!ids || ids.length === 0) {
				return [];
			}
			return data.stories.access.stories(ids, {
				params: {
					AttributesToGet: utils.storiesAttributes
				},
				sort: true
			});
		});
};
