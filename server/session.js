"use strict";

var session = require('express-session'),
    config  = require('./config.js'),
    mongoStore = require('connect-mongo')({
		session: session
	});

module.exports = function (app) {

	// Express MongoDB session storage
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessions.secret,
		store: new mongoStore(config.sessions.db)
	}));

};
