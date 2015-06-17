var express = require('express'),
  core = require('ournet.core'),
  _ = core._,
  Promise = core.Promise,
  util = require('util'),
  utils = require('../utils.js'),
  route = module.exports = express.Router(),
  ShareInfo = require('../share_info.js'),
  Data = require('../data');

//video_frame

route.get('/:ul' + utils.localePrefix + '?/controls/video_frame/:id', function(req, res, next) {
  var config = res.locals.config;
  var ids = req.params.id.split(',');
  utils.maxageVideoFrame(res);

  var currentCulture = res.locals.currentCulture,
    links = res.locals.links,
    __ = res.locals.__;

  Data.videos.access.videos({
    ids: ids
  }).then(function(videos) {
    if (!videos || videos.length === 0) {
      utils.maxage(1);
      return res.render('nodata.jade');
    }
    videos = _.sortBy(videos, function(video) {
      return video.sourceType.length;
    });
    videos.reverse();
    res.render('video_frame.jade', {
      videos: videos
    });
  }).catch(next);
});
