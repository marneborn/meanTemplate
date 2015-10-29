"use strict";

module.exports = {
    facebook: { // FIXME - not handled yet
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	google: {
		clientID: null, // set in secrets.js
		clientSecret: null, // set in secrets.js
        passportArg : {
            scope: [
		        'https://www.googleapis.com/auth/userinfo.profile',
		        'https://www.googleapis.com/auth/userinfo.email'
	        ]
        },
		callbackURL: '/auth/google/callback'
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
