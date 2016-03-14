"use strict";

const LinkedInStrategy = require('passport-linkedin').Strategy,
    config = require('../../config');

module.exports.load = function (passport, User) {

    new User() /* jshint ignore:line */

    passport.use(
        new LinkedInStrategy(
            {
                consumerKey: config.authenticate.linkedin.clientID,
                consumerSecret: config.authenticate.linkedin.clientSecret,
                callbackURL: config.authenticate.linkedin.callbackURL,
                passReqToCallback: true,
                profileFields: ['id', 'first-name', 'last-name', 'email-address']
            },

            function(req, accessToken, refreshToken, profile, done) { /* jshint ignore:line */

                // Set the provider data and include tokens
                let providerData = profile._json;
                providerData.accessToken = accessToken;
                providerData.refreshToken = refreshToken;

                // Create the user OAuth profile
                let providerUserProfile = {
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    username: profile.username,
                    provider: 'linkedin',
                    providerIdentifierField: 'id',
                    providerData: providerData
                };

                // Save the user OAuth profile
                users.saveOAuthUserProfile(req, providerUserProfile, done);
            }
        ));
    return module.exports;
};
