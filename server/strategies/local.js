'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

module.exports = function() {
    // Use local strategy

    passport.use('local', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function(username, password, done) {

            User.findOne(
                {
                    username: username
                },
                function(err, user) {
                    if (err) {
                        done(err);
                        return;
                    }
                    if (!user) {
                        done(null, false, {
                            message: 'Unknown user or invalid password'
                        });
                        return;
                    }

                    user.authenticate(password, function(err, result) {
                        if (err) {
                            done(err);
                            return;
                        }

                        if (result) {
                            done(null, user);
                        }
                        else {
                            done(null, false, {
                                message: 'Unknown user or invalid password'
                            });
                        }
                    });
                });
        }));
};
