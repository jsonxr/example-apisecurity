module.exports = function (app) {

  var userController = {};
  userController.home = function (req, res) {
    res.status(200).send('Hello world');
  };
  return userController;

};
