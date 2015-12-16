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
 *          "Authorized JavaScript origins": http://local.meantemplate.com:8080
 *          "Authorized redirect URIs": http://local.meantemplate.com:8080/auth/google/callback
 *      If real host known - (Button) "Add credentials"
 *        Select Web application
 *          Name : "Deploy"
 *          "Authorized JavaScript origins": http://the.url
 *          "Authorized redirect URIs": http://the.url/auth/google/callback
 *   Get "Client ID" and "Client secret" assigned by google, enter into server/config/secrets.js
 */

var L = require('../../../logger')('user:authenticate:google'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	config = require('../../../config'),
    common = require('./common');

module.exports = {
    name: 'google',
    load: load,
    createNewUser: createNewUser,
    getEmail: getEmail
};

/*
 *
 */
function load (passport, User) {

    L.debug("Adding Google OAuth2");
	passport.use('google', new GoogleStrategy(
        {
			clientID: config.authenticate.google.clientID,
			clientSecret: config.authenticate.google.clientSecret,
			callbackURL: config.authenticate.google.callbackURL,
			passReqToCallback: true
		},
        common.createPassportFunction(User, module.exports)
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

/*
 *
 */
function getEmail (providerData) {
    return providerData.emails[0].value;
}
