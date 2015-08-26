"use strict";

var express  = require('express'),
    passport = require('passport'),
    user     = require('../server/user'),
    router   = express.Router();

router.route('/user/signup')
.post(user.signup);

router.route('/user/signin')
.post(user.signin);

router.route('/user/signout')
.post(user.signout)
.get(user.signout);

// Setting the google oauth routes
router.route('/auth/google').get(passport.authenticate('google', {
	scope: [
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email'
	]
}));
// router.route('/auth/google/callback').get(users.oauthCallback('google'));
router.route('/auth/google/callback').get(user.providerLogin('google'));
// function (req, res, next) {
//     console.log("google auth callback");
// });

module.exports = router;
