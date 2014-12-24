module.exports = function (app) {
  var services = app.locals.services;
  var userController = {};

  userController.findUserById = function (req, res, next, userId) {
    console.log('findUserById: ' + userId);
    //var userId = req.params.userId;
    services.userService.findById(userId, function (err, user) {
      req.user = user;
      next(err);
    });
  };

  userController.list = function (req, res) {
    console.log('list');
    services.userService.list(function (err, list) {
      res.json(list);
    });
  };

  userController.create = function get(req, res) {
    console.log('create');
    res.json(
      { id: "1", "username": "jason" }
    );
  };

  userController.read = function get(req, res) {
    console.log('get');
    res.json(req.user);
  };

  userController.update = function get(req, res) {
    console.log('update');
    res.json(
      { id: "1", "username": "jason" }
    );
  };

  userController.delete = function get(req, res) {
    console.log('delete');
    res.status(200).send();
  };

  return userController;

};
