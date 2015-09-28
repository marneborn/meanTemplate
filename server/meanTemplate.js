"use strict";

var	path = require('path'),
    globule = require('globule'),
    BPromise = require('bluebird'),
	L = require('./logger')('server'),

	// express middleware
	cookieParser = require('cookie-parser'),
	bodyParser   = require('body-parser'),

	// Create the express app
	app = require('./createApp');

L.debug("Starting server");
var dbOpen = require('./db').connect();

// first thing is to server static files
app.use(require('./static'));

// Parse the request to put the cookie on req.cookie
// FIXME - move these to the individual routers that need them
app.use(cookieParser());

// Wait for the body of the request and put it on req.body
// FIXME - move these to the individual routers that need them
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./session')(app);
require('./authentication')(app);

require('./engine')(app);

globule.find('server/routes/*.routes.js').forEach(function (file) {
    app.use(require(path.resolve(file)));
});

// The very last thing is to send 404
app.use(function (req, res) {
	res.status(404).sendFile(path.resolve('web/404.html'));
});

// listenToMe added to app in createApp above
BPromise
.all([dbOpen])
.then(function () {
    return app.listenToMe();
})
.catch(function (err) {
    L.fatal("Couldn't start listener: "+err);
});
