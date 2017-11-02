const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

function init(app, usr) {
    passport.use('local', new LocalStrategy(
        function(username, password, done) {
            usr._user.findOne({
                username: username
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect username.'
                    });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                return done(null, user);
            });
        }
    ));
    passport.serializeUser(function(username, done) {
        done(null, username._id);
    });
    passport.deserializeUser(function(id, done) {
        usr._user.findById(id, function(err, username) {
            done(err, username);
        });
    });
    
    app.use(session({
        secret: 'ilovescotchscotchyscotchscotch'
    })); // session secret
    app.use(passport.initialize());
    app.use(passport.session());

    
}

module.exports.init = init
module.exports.passport = passport
