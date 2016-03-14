"use strict";

const express  = require('express'),
      passport = require('passport'),
      userCtrl = require('./user.controller'),
      config   = require('../config').authenticate,
      router   = express.Router();

module.exports = router;

// Common
router.route('/user/update')
    .post(userCtrl.update);

router.route('/user/signout')
    .post(userCtrl.signout)
    .get(userCtrl.signout);

// Local
router.route('/user/signup')
    .post(userCtrl.signup);

router.route('/user/signin')
    .post(userCtrl.signin);

// Google
router.route('/auth/google')
    .get(passport.authenticate(
        'google',
        config.google.passportArg
    ));

router.route(config.google.callbackURL)
    .get(userCtrl.providerLogin('google'));

// Facebook
router.route('/auth/facebook')
    .get(passport.authenticate(
        'facebook',
        config.facebook.passportArg
    ));

router.route(config.facebook.callbackURL)
    .get(userCtrl.providerLogin('facebook'));
