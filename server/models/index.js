var mongoose = require('mongoose');

var UserSchema = require('./user-schema');

function Models(uri, options) {
  // Default options if they aren't passed to us
  var self = Object.create(Models);
  return self;
}

Models.open = function open(uri, options, callback) {
  var self = this;

  // options is optional
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  options = options || {
    server: {
      poolSize: 5,
      socketOptions: {
        keepAlive: 1,
        connectTimeoutMS: 500
      }
    }
  };
  self.uri = uri;
  self.options = options;
  self.connected = false;
  self.conn = null;
  self.conn = mongoose.createConnection(self.uri, self.options);
  self._registerModels();
  self._registerListeners(callback);
};

Models._registerModels = function _connectListeners() {
  var self = this;
  self.User = self.conn.model('User', UserSchema);
};

Models._registerListeners = function _registerListeners(callback) {
  var self = this;
  self.conn.on('open', function onopen() {
    console.log('opened connection to mongo server.');
    if (callback) {
      callback();
    }
  });

  self.conn.on('connected', function onconnected() {
    self.connected = true;
    console.log('connected to mongo server');
  });

  self.conn.on('disconnected', function ondisconnected() {
    self.connected = false;
    console.log('disconnected from mongo server.');
  });

  self.conn.on('close', function onclose() {
    self.connected = false;
    console.log('closed connection to mongo server');
  });

  self.conn.on('error', function onerror(err) {
    console.log({ err: err }, 'error in mongo server');
  });

  self.conn.on('reconnect', function onreconnect() {
    console.log('reconnect to mongo server.');
  });
};

Models.close = function close(callback) {
  var self = this;
  if (self.conn) {
    self.conn.close(callback);
    self.conn = null;
  }
};

module.exports = Models;
