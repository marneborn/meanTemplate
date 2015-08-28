"use strict";

/*
 * The local strategy is when the user signs up and logs in via a username and password
 */
var LocalStrategy = require('passport-local').Strategy;

module.exports.load = function (passport, User) {

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
    return module.exports;
};

module.exports.makeUser = function (form) {
    return {
        email       : form.email,
        displayname : form.username, // FIXME - pick some unique+psuedorandom name that isn't the username as the base for this.
        password    : form.password, // pre-save hook will hash
        roles       : ['user'],
        providers   : [{
            source : 'local',
            lookup : form.username
        }]
    };
};
