"use strict";

/*
 * The local strategy is when the user signs up and logs in via a username and password
 */
var LocalStrategy = require('passport-local').Strategy;

module.exports = {
    name: 'local',
    load: load,
    createNewUser: createNewUser,
    createProvider: createProvider
};

function load (passport, User) {

    passport.use('local', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function(username, password, done) {
            User.findOne(
                {
                    providers : {
                        $elemMatch: {
                            source: 'local',
                            lookup: username
                        }
                    }
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
}

/*
 *
 */
function createNewUser (form) {
    return {
        email       : form.email,
        // FIXME - pick some unique+psuedorandom name that isn't the username as the base for this.
        displayname : form.username,
        password    : form.password, // pre-save hook will hash
        roles       : ['user'],
        providers   : [createProvider(form)]
    };
}

/*
 *
 */
function createProvider (form) {
    return {
        source : 'local',
        lookup : form.username
    };
}
