var express = require('express');
var middleware = require('../middleware');

module.exports = function(app) {
  var router = express.Router();


  router.use('/api/users', middleware(app).api, require('./user-routes')(app));
  router.use('/api/assets', require('./user-routes')(app));

  return router;
};
