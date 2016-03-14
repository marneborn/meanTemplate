"use strict";

/*
 * Authenticate through facebook's oath2 service.
 * To register the app with facebook:
 *   goto https://developers.facebook.com/apps/
 *   drop down -> "Create a project..."
 *   (Button) "Add a New App"
 *   Select "Website"
 *   Enter name
 *   (Button) "Create New Facebook App ID"
 *   (Drop down) "Category" : pick the appropriate one
 *   (Button) "Create App ID"
 *   Wait...
 *   "Site URL" : http://local.meantemplate.com:8080
 *   (Button) Next
 *   (Link) "Skip to Developer Dashboard"
 *   (Sidebar) Test Apps
 *     (Button) Create a Test App
 *     (Button) Create Test App
 *   (Button) Settings:
 *      Get App ID and put in secrets.js
 *      Get App Secret and put in secrets.js
 *     (Tab) Advanced
 *       Deauthorize Callback URL: http://local.meantemplate.com:8080/auth/facebook/deauth
 *       Valid OAuth redirect URIs : http://local.meantemplate.com:8080/auth/facebook/callback
 *     (Button) Save Changes
 */

var L = require('../../logger')('user:authenticate:facebook'),
    FacebookStrategy = require('passport-facebook').Strategy,
	config = require('../../config'),
    common = require('./common');

module.exports = {
    name: 'facebook',
    load: load,
    createNewUser: createNewUser,
    getEmail: getEmail
};


function load (passport, User) {

    L.debug("Adding Facebook authentication");
	passport.use(new FacebookStrategy(
        {
		    clientID: config.authenticate.facebook.clientID,
		    clientSecret: config.authenticate.facebook.clientSecret,
		    callbackURL: config.fullHost+config.authenticate.facebook.callbackURL,
		    passReqToCallback: true,
            profileFields: config.authenticate.facebook.profileFields
	    },
        common.createPassportFunction(User, module.exports)
    ));
}

/*
 *
 */
function createNewUser (providerData, User) {
    return new User({
        email       : providerData.email,
        displayname : providerData.name,
        providers   : [
            {
                source : 'facebook',
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
    return providerData.email;
}
