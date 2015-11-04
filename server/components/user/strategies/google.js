"use strict";

/*
 * Authenticate through google's oath2 service.
 * To register the app with google:
 *   goto https://console.developers.google.com/
 *   drop down -> "Create a project..."
 *   enter name click 'Create', wait till created
 *
 *   "APIs & Auth" -> Credentials -> (Tab) "OAuth consent screen"
 *      Fill in form
 *      "Save"
 *   "APIs & Auth" -> Credentials -> (Tab) "Credientials"
 *      (Button) "Add credentials"
 *        Select Web application
 *          Name : "Local Development
 *          "Authorized JavaScript origins": http://127.0.0.1:8080
 *          "Authorized redirect URIs": http://127.0.0.1:8080/auth/google/callback
 *      If real host known - (Button) "Add credentials"
 *        Select Web application
 *          Name : "Deploy"
 *          "Authorized JavaScript origins": http://the.url
 *          "Authorized redirect URIs": http://the.url/auth/google/callback
 *   Get "Client ID" and "Client secret" assigned by google, enter into server/config/secrets.js
 */

var l = require('../../../logger')('user:authenticate:google'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	config = require('../../../config');

module.exports.load = function (passport, User) {

    l.debug("Adding Google OAuth2");
	passport.use('google', new GoogleStrategy(
        {
			clientID: config.authenticate.google.clientID,
			clientSecret: config.authenticate.google.clientSecret,
			callbackURL: config.authenticate.google.callbackURL,
			passReqToCallback: true
		},

		function(req, accessToken, refreshToken, profile, done) { /* jshint ignore:line */

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
                        l.err("Problem getting google user: "+err+(err.stack ? "\n"+err.stack : ""));
                        done(err);
                        return;
                    }

                    var existingProvider,
                        changed = false;

                    // README.txt Handling provider signup case #1
                    if (!user) {
                        l.debug("Creating new user: "+providerData.displayName);
                        changed = true;
                        user = createNewUser(providerData, User);
                    }

                    else {
                        l.debug("Found user: "+user.displayname);

                        existingProvider = user.getProvider('google');

                        // README.txt Handling provider signup case #2
                        if (!existingProvider) {
                            l.debug("Adding goolge auth to existing user");
                            changed = true;
                            user.providers.push({
                                source : 'google',
                                lookup : providerData.id,
                                details: providerData
                            });
                        }

                        // README.txt Handling provider signup case #3
                        else if (existingProvider.lookup !== providerData.id) {
                            /* jshint -W101 */
                            done(new Error("There is already an different google account associated with this user: "+user.email));
                            /* jshint +W101 */
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
