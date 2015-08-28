"use strict";

var passport = require('passport'),
    User = require('mongoose').model('User');

module.exports = function (app) {

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

    require('./authentication/strategies/all').load(passport, User);
};
