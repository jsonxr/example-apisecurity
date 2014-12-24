module.exports = function (app) {
  var middleware = {};
  middleware.auth = require('./auth')(app);
  middleware.api = [middleware.auth];
  return middleware;
};
