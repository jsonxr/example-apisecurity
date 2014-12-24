module.exports = function (app) {
  services = {
    userService: require('./user-service')(app)
  };
  return services;
};

