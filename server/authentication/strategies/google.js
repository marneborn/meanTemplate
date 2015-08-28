"use strict";

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	config = require('../../config'),
    user; //FIXME placeholder

module.exports.load = function (passport, User) {
    new User();

	passport.use('google', new GoogleStrategy({
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: config.google.callbackURL,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
//             console.log("pd> "+JSON.stringify(profile._json, null, 4));
//             console.log("at> "+accessToken);
//             console.log("rt> "+refreshToken);

			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			// Create the user OAuth profile
			var providerUserProfile = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: profile.emails[0].value,
				username: profile.username,
				provider: 'google',
				providerIdentifierField: 'id',
				providerData: providerData
			};
            console.log(""+JSON.stringify(providerUserProfile, null, 4));

			// Save the user OAuth profile
			user.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
    return module.exports;
};
