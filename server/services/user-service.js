module.exports = function (app) {
  var User = app.locals.models.User;
  var userService = {
    list: function (callback) {
      User.find({}, callback);
    },
    findById: function (id, callback) {
      User.findById(id, callback);
    }
  };
  return userService;
};
