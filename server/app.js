var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');

var app = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use passport session
app.use(passport.initialize());
app.use(passport.session());

// Add db
var models = require('./models');
models.open('mongodb://localhost/partners');
app.locals.models = models;

var services = require('./services')(app);
app.locals.services = services;

// Include routes
app.use('/', require('./routes')(app));

app.start = function start(callback) {
  callback();
};

app.stop = function stop(callback) {
  callback();
};

module.exports = app;
