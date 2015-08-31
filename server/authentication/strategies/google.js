"use strict";

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	config = require('../../config');

module.exports.load = function (passport, User) {

	passport.use('google', new GoogleStrategy({
			clientID: config.authenticate.google.clientID,
			clientSecret: config.authenticate.google.clientSecret,
			callbackURL: config.authenticate.google.callbackURL,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {

            // FIXME - handle !!req.user (ie valid session)
            //         yo-mean merges the logged in user with the provider accunt.
            //         this doesn't seem right to me...
            //         maybe a separate "link accounts" call?
            if (req.user)
                req.logout();

			// Set the provider data and include tokens
			var providerData = profile._json,
                findByProvider = {
                    providers : {
                        $elemMatch: {
                            source: 'google',
                            lookup: providerData.id
                        }
                    }
                },
                findByEmail = {
                    email : providerData.emails[0].value
                };

			providerData.accessToken  = accessToken;
			providerData.refreshToken = refreshToken;

		    User.findOne(
                { $or : [ findByProvider, findByEmail ] },
                function (err, user) {

                    if (err) {
                        done(err);
                        return;
                    }

                    var existingProvider,
                        changed = false;

                    // README.txt Handling provider signup case #1
                    if (!user) {
                        changed = true;
                        user = createNewUser(providerData, User);
                    }

                    else {

                        existingProvider = user.getProvider('google');

                        // README.txt Handling provider signup case #2
                        if (!existingProvider) {
                            changed = true;
                            user.providers.push({
                                source : 'google',
                                lookup : providerData.id,
                                details: providerData
                            });
                        }

                        // README.txt Handling provider signup case #3
                        else if (existingProvider.lookup !== providerData.id) {
                            done(new Error("There is already an different google account associated with this user: "+user.email));
                            return;
                        }

                        // README.txt Handling provider signup case #4 and #5
                        // do nothing.
                        // FIXME - special handling #4 somehow?
                    }

                    if (changed) {
                        user.save(function(err) {
     					    done(err, user);
                        });
                    }

                    else {
                        done(null, user);
                    }

                }
            );
		}
	));
    return module.exports;
};

/*
 *
 */
function createNewUser (providerData, User) {
    return new User({
        email       : providerData.emails[0].value,
        displayname : providerData.displayName,
        providers   : [
            {
                source : 'google',
                lookup : providerData.id,
                details: providerData
            }
        ]
    });
}
