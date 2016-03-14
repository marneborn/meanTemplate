"use strict";

module.exports = {
    facebook: {
		clientID: null, // set in secrets.js
		clientSecret: null, // set in secrets.js
		callbackURL: '/auth/facebook/callback',
        passportArg : {
            scope: ['email', 'user_location']
        },
        profileFields: ['id', 'displayName', 'last_name', 'first_name', 'email', 'location']
	},
	google: {
		clientID: null, // set in secrets.js
		clientSecret: null, // set in secrets.js
		callbackURL: '/auth/google/callback',
        passportArg : {
            scope: [
		        'https://www.googleapis.com/auth/userinfo.profile',
		        'https://www.googleapis.com/auth/userinfo.email'
	        ]
        }
	},
	linkedin: { // FIXME - not handled yet
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: { // FIXME - not handled yet
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	}
};
