"use strict";

var	path = require('path'),
    globule = require('globule'),
	L    = require('./server/logger')('server'),

	// express middleware
	cookieParser = require('cookie-parser'),
	bodyParser   = require('body-parser'),

	// Create the express app
	app = require('./server/createApp');

L.debug("Starting server");
require('./server/db');
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

require('./server/authentication')(app);

globule.find('routes/*.routes.js').forEach(function (file) {
    app.use(require(path.resolve(file)));
});

// The very last thing is to send 404
app.use(function (req, res) {
	res.status(404).sendFile(path.resolve('web/404.html'));
});

// listenToMe added to app in createApp above
app.listenToMe();
