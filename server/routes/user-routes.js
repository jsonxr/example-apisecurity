var express = require('express');

module.exports = function (app) {
  var users = require('../controllers/user-controller')(app);
  var router = express.Router();

  router.route('/')
    .get(users.list)
    .post(users.create);

  router.route('/:userId')
    .get(users.read)
    .put(users.update)
    .delete(users.delete);

  // If :userId is in param, execute findUserById
  router.param('userId', users.findUserById);

  return router;
};
