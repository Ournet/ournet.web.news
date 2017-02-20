'use strict';

var express = require('express');
var utils = require('../utils');
var _ = utils._;
/*eslint new-cap:1*/
var route = module.exports = express.Router();
var Data = require('../data');

//video_frame

route.get('/:ul' + utils.localePrefix + '?/controls/video_frame/:id', function(req, res, next) {
	var ids = req.params.id.split(',');

	utils.maxageVideoFrame(res);

	Data.get({
		videos: ['videos', { ids: ids }]
	}).then(function(result) {
		let videos = result.videos;
		if (!videos || videos.length === 0) {
			// utils.maxage(1);
			return res.end();
		}
		videos = _.sortBy(videos, function(video) {
			return video.sourceType.length;
		});
		videos.reverse();
		res.render('video_frame.jade', {
			videos: videos
		});
	}, next);
});
