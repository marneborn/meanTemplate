"use strict";

var express  = require('express'),
    passport = require('passport'),
    user     = require('./user'),
    config   = require('../../config'),
    router   = express.Router();

module.exports = router;

router.route('/user/signup')
.post(user.signup);

router.route('/user/signin')
.post(user.signin);

router.route('/user/update')
.post(user.update);

router.route('/user/signout')
.post(user.signout)
.get(user.signout);

router.route('/auth/google')
.get(passport.authenticate(
    'google',
    config.authenticate.google.passportArg
));

router.route(config.authenticate.google.callbackURL)
.get(user.providerLogin('google'));