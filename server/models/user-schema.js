var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;

var UserSchema = mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, required: true },

  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },

  lastLoginUtc: { type: Date, default: Date.now },
  createdUtc: { type: Date, default: Date.now },
  updatedUtc: { type: Date, default: Date.now }
}, { autoIndex: true });

/**
 * Need to save the hashed password if it changed
 */
UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) { return next(); }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) { return next(err); }

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) { return next(err); }

      // set the hashed password back on our user document
      user.password = hash;
      next();
    });
  });
});


UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
};


UserSchema.statics.hashPassword = function hashPassword(password, next) {
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) { return next(err); }

    // hash the password using our new salt
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) { return next(err); }

      // set the hashed password back on our user document
      next(null, hash);
    });
  });
};

/**
 * Usage: User.getAuthenticated(username, password, function (err, user) {
 *  if (err) {
 *    //oops, what happened
 *  } else {
 *    if (user) {
 *      // yay! authenticated...
 *    } else {
 *      // not found
 *    }
 *  }
 * });
 * @param username
 * @param password
 * @param cb
 */
UserSchema.statics.getAuthenticated = function getAuthenticated(username, password, cb) {
  this.findOne({ username: username }, function(err, user) {

    if (err) {
      console.log('user.js...err: '+err);
      return cb(err);
    }

    // make sure the user exists
    if (!user) {
      return cb(null,null);
    } else {
      // test for a matching password
      user.comparePassword(password, function(err, isMatch) {
        if (err) { return cb(err); }
        if (isMatch) {
          var updates = {
            $set: { lastLoginUtc: new Date() }
          };
          return user.update(updates, function(err) {
            cb(err, user);
          });
        } else {
          cb(null, null);
        }
      });
    }


  });
};


// create the model for users and expose it to our app
//module.exports = mongoose.model('User', userSchema);
module.exports = UserSchema;
