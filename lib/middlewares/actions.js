var core = require('ournet.core'),
  md5 = core.util.md5,
  Promise = core.Promise,
  url = require('url');

module.exports = function(req, res, next) {
  var ref = req.header('Referer');
  if (!ref || url.parse(ref).hostname !== req.hostname) {
    //return res.status(401);
  }
  next();
};
