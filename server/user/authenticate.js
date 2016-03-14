"use strict";

const express = require('express'),
      L       = require('../logger')('user:authenticate'),
      sessInfo = require('../config').sessions,
      passport = require('passport'),
      session = require('express-session'),
      MongoStore = require('connect-mongo')({
          session: session
      }),
      User = require('./user.model'),
      strategies = require('./strategies');

L.debug("Creating passport middleware");
let router = module.exports = express.Router();

// Express MongoDB session storage
router.use(session({
    saveUninitialized: true,
    resave: true,
    secret: sessInfo.secret,
    store: new MongoStore(sessInfo.db)
}));

// use passport session
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// Deserialize sessions
passport.deserializeUser(function(id, done) {

    User.findOne(
        {
            _id: id
        },
        '-salt -password',
        function(err, user) {
            done(err, user);
        }
    );
});

strategies.load(passport, User);
