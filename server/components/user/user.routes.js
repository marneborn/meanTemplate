"use strict";

var express  = require('express'),
    passport = require('passport'),
    userCtrl = require('./user.controller'),
    config   = require('../../config'),
    router   = express.Router();

module.exports = router;

router.route('/user/signup')
.post(userCtrl.signup);

router.route('/user/signin')
.post(userCtrl.signin);

router.route('/user/update')
.post(userCtrl.update);

router.route('/user/signout')
.post(userCtrl.signout)
.get(userCtrl.signout);

router.route('/auth/google')
.get(passport.authenticate(
    'google',
    config.authenticate.google.passportArg
));

router.route(config.authenticate.google.callbackURL)
.get(userCtrl.providerLogin('google'));
