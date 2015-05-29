var middlewares = require('../middlewares');

exports = module.exports = function(app) {
  app.use(require('./redirects.js'));
  app.use('/actions', middlewares.actions);
  app.use(middlewares.root);
  // app.use(require('./redirects.js'));
  // app.use(require('./json.js'));
  app.use(middlewares.news);
  app.use(require('./actions.js'));
  app.use(require('./home.js'));
  app.use(require('./stories.js'));
  app.use(require('./news.js'));
  app.use(require('./topics.js'));
  // app.use(place);
  // app.use(require('./places.js'));
  // app.use(require('./controls.js'));
};
