
module.exports = function (app) {
  var controllers = {
    userController: require('./user-controller')(app),
    homeController: require('./home-controller')(app)
  };
  return controllers;
};
