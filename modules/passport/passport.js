const express = require('express')
const router = express.Router()
const path = require('path');
const appDir = path.dirname(require.main.filename),
 LocalStrategy = require('passport-local').Strategy;
const user = require(path.join(appDir, '/modules/database/schemas/user.js'));

module.exports= function(passport) {
  
passport.use('local', new LocalStrategy(
  function(username, password, done) {
 
    user.user.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
passport.serializeUser(function(username, done) {
  done(null, username._id);
});
passport.deserializeUser(function(id, done) {
  user.user.findById(id, function(err, username) {
    done(err, username);
  });
});

}