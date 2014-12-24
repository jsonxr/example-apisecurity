var express = require('express');
var middleware = require('../middleware');

module.exports = function(app) {
  var router = express.Router();

  router.use('/api', middleware(app).api);
  router.use('/api/users', require('./user-routes')(app));

  return router;
};
