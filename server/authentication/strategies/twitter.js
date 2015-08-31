"use strict";

var TwitterStrategy = require('passport-twitter').Strategy,
	config = require('../../config'),
    users; // FIXME - tmp

module.exports.load = function (passport, User) {
    new User(); // FIXME

	passport.use(new TwitterStrategy({
			consumerKey: config.authenticate.twitter.clientID,
			consumerSecret: config.authenticate.twitter.clientSecret,
			callbackURL: config.authenticate.twitter.callbackURL,
			passReqToCallback: true
		},
		function(req, token, tokenSecret, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
			providerData.token = token;
			providerData.tokenSecret = tokenSecret;

			// Create the user OAuth profile
			var providerUserProfile = {
				displayName: profile.displayName,
				username: profile.username,
				provider: 'twitter',
				providerIdentifierField: 'id_str',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
    return module.exports;
};
