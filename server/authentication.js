"use strict";

var globule = require('globule'),
    path = require('path'),
    config  = require('./config.js'),
    serverUtils = require('./utils.js'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')({
		session: session
	}),
    passport = require('passport'),
	User = require('mongoose').model('User'),
    foo;


module.exports = function (app) {

	// Express MongoDB session storage
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessions.secret,
		store: new mongoStore(config.sessions.db)
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

    passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User.findOne({
			_id: id
		}, '-salt -password', function(err, user) {
			done(err, user);
		});
	});

    require('./strategies/local.strategy')();

// 	globule.find('./strategies/*.js').forEach(function(strategy) {
// 		require(path.resolve(strategy))();
// 	});

};
