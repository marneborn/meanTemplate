"use strict";

var express    = require('express'),
	path       = require('path'),
	l          = require('./server/logger')('server'),

	// express middleware
	cookieParser = require('cookie-parser'),
	bodyParser   = require('body-parser'),

	// Create the express app
	app = require('./server/createApp');

require('./server/engine')(app);

// first thing is to server static files
app.use(require('./server/static'));

// Parse the request to put the cookie on req.cookie
// FIXME - move these to the individual routers that need them
app.use(cookieParser());

// Wait for the body of the request and put it on req.body
// FIXME - move these to the individual routers that need them
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// The very last thing is to send 404
app.use(function (req, res, next) {
	res.status(404).sendFile(path.resolve('web/404.html'));
});

// listenToMe added to app in createApp above
app.listenToMe();
