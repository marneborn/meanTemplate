"use strict";

const GithubStrategy = require('passport-github').Strategy,
      config = require('../../config');

module.exports.load = function (passport, User) {
    new User(); /* jshint ignore:line */

    passport.use(new GithubStrategy(
        {
            clientID: config.authenticate.github.clientID,
            clientSecret: config.authenticate.github.clientSecret,
            callbackURL: config.authenticate.github.callbackURL,
            passReqToCallback: true
        },

        function(req, accessToken, refreshToken, profile, done) { /* jshint ignore:line */

            // Set the provider data and include tokens
            let providerData = profile._json;
            providerData.accessToken = accessToken;
            providerData.refreshToken = refreshToken;

            // Create the user OAuth profile
            let providerUserProfile = {
                displayName: profile.displayName,
                email: profile.emails[0].value,
                username: profile.username,
                provider: 'github',
                providerIdentifierField: 'id',
                providerData: providerData
            };

            // Save the user OAuth profile
            users.saveOAuthUserProfile(req, providerUserProfile, done);
        }
    ));
    return module.exports;
};
