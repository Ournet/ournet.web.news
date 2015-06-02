require('dotenv').load();
var
  core = require('ournet.core');

core.Logger.init({
  tags: ['news'],
  json: true
});

if (process.env.MODE !== 'dev') {
  core.logger.warn('Starting app...', {
    maintenance: 'start'
  });
}

var
  express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  Promise = core.Promise,
  routes = require('./routes'),
  i18n = require('./i18n'),
  utils = require('./utils.js'),
  boot = require('./boot.js'),
  app,
  startDate = Date.now();

function createApp() {
  if (app) return;
  app = express();

  app.disable('x-powered-by');
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  //app.set('utils', utils);
  app.disable('etag');
  //app.set(require('./etag'));

  app.use(bodyParser.json()); // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
  }));
  app.use(methodOverride());
  //app.use(responseTime());
  if (process.env.MODE === 'dev') {
    app.use(require('morgan')('dev'));
  }

  app.use(boot);

  if (process.env.MODE !== 'dev') {
    app.use(function(req, res, next) {
      if (!req.headers['x-amz-cf-id']) {
        var config = res.locals.config;
        //console.log('Erorr: ', req.headers);
        return res.redirect('http://' + config.host + req.originalUrl);
      }
      next();
    });
  }
  app.use(express.static(__dirname + '/public', {
    maxAge: process.env.MODE === 'dev' ? 0 : (1000 * 60 * 15)
  }));

  app.use(i18n);
  routes(app);

  app.all('*', function(req, res) {
    core.logger.warn('404 Not Found', {
      hostname: req.hostname,
      url: req.originalUrl
    });
    var currentCulture = res.locals.currentCulture,
      links = res.locals.links;
    res.redirect(links.home({
      ul: currentCulture.lang
    }));
    //res.status(404).end();
  });

  app.use(function(error, req, res, next) {
    catchError(req, res, error);
  });

  app.on('uncaughtException', function(req, res, route, error) {
    catchError(req, res, error);
  });

  //app.use(router);
  app.listen(process.env.PORT || 6061);
  //console.log('server started');
}

function catchError(req, res, error) {
  core.logger.error(error.message || 'errorHandler', {
    hostname: req.hostname,
    url: req.originalUrl,
    stack: error.stack
  });

  utils.maxage(res, 0);

  res.status(error.code || error.statusCode || 500).send('Error!');
}

createApp();

process.on('uncaughtException', function(err) {
  core.logger.error('uncaughtException: ' + err.message, {
    trace: err.trace
  });
});


function testProcess() {
  var memory = parseInt(process.memoryUsage().rss / 1048576);
  var time = (Date.now() - startDate) / 1000 / 60;
  time = parseInt(time);
  var MEMORY = parseInt(process.env.MEMORY_LIMIT);
  if (memory > MEMORY) {
    core.logger.error('Memory overload', {
      memory: memory,
      runtime: time,
      maintenance: 'stop'
    });
    setTimeout(function() {
      return process.kill(process.pid);
    }, 1000 * 10);
  }
}

if (process.env.MODE !== 'dev') {
  setInterval(testProcess, 1000 * 60 * 5);
}
