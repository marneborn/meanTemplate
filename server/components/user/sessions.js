"use strict";

var session = require('express-session'),
    mongoStore = require('connect-mongo')({
		session: session
	}),
    passport = require('passport'),
    User = require('mongoose').model('User');

module.exports = function (app, sessInfo) {

	// Express MongoDB session storage
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: sessInfo.secret,
		store: new mongoStore(sessInfo.db)
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

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
};
