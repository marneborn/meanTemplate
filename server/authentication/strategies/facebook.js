"use strict";

var FacebookStrategy = require('passport-facebook').Strategy,
	config = require('../../config'),
    users; //FIXME placeholder

module.exports.load = function (passport, User) {
    new User(); // FIXME placeholder
	passport.use(new FacebookStrategy({
			clientID: config.authenticate.facebook.clientID,
			clientSecret: config.authenticate.facebook.clientSecret,
			callbackURL: config.authenticate.facebook.callbackURL,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			// Create the user OAuth profile
			var providerUserProfile = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: profile.emails[0].value,
				username: profile.username,
				provider: 'facebook',
				providerIdentifierField: 'id',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
    return module.exports;
};
