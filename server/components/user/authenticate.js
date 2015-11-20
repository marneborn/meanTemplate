"use strict";

var express = require('express'),
	l       = require('../../logger')('user:authenticate'),

    passport = require('passport'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')({
		session: session
	}),
    User = require('./user.model'),

	// create and export the static router
	router = null;

module.exports = function (sessInfo) {

    if (router)
        return router;

    l.debug("Creating passport middleware");
    router = express.Router();

	// Express MongoDB session storage
	router.use(session({
		saveUninitialized: true,
		resave: true,
		secret: sessInfo.secret,
		store: new mongoStore(sessInfo.db)
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

    require('./strategies/all')
    .load(passport, User);

    return router;
};
