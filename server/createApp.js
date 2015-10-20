"use strict";

var express = require('express'),
	http    = require('http'),
	https   = require('https'),
	fs      = require('fs'),
	path    = require('path'),
	config  = require('./config'),
	l       = require('./logger')('createApp'),

	// will override the formatArgs function below, so need to kee the orig
	debug   = require('debug'),
	first   = debug('first'),
	origFormat = debug.formatArgs,

	// Create and export the express app.
	app     = module.exports = express();

// Conditionally print some info on every request.
if (first.enabled) {
	app.use( function (req, res, next) {
		// Use my special formatting here and only here.
		debug.formatArgs = formatArgs;
		first("URL = "+req.method+' '+req.url);
		debug.formatArgs = origFormat;
		next();
	});
}

// Add a "listenToMe" method to the app to create the listeners.
app.listenToMe = function () {
	var opts;

	if ( config.port ) {
		http.createServer(app).listen(config.port, function () {
			l.log("HTTP Express server listening on port " + config.host + ':' +config.port);
		});
	}

	if ( config.sport) {
		opts = config2sslOptions(config);
		https.createServer(opts, app).listen(config.sport, function() {
			l.log("HTTPS Express server listening on sport " + config.host + ':' +config.sport);
		});
	}
};

/*
 * Build the SSL Options needed by nodes https.createServer
 */
function config2sslOptions (config) {
	var sslOptions = {
		key:	fs.readFileSync(path.resolve(process.cwd(), config.sslOptions.key)).toString(),
		cert:	fs.readFileSync(path.resolve(process.cwd(), config.sslOptions.cert)).toString()
	};

	if (config.sslOptions.passphrase)
		sslOptions.passphrase = config.sslOptions.passphrase;

	if (config.sslOptions.ca.length) {
		sslOptions.ca = [];
		for (var ca = 0; ca < config.sslOptions.ca.length; ca++)
			sslOptions.ca.push(fs.readFileSync(path.resolve(process.cwd(), config.sslOptions.ca[ca])).toString());
	}

	return sslOptions;
}

/*
 *
 */
function formatArgs () {
    /* jshint validthis: true */
	var args     = arguments,
		name     = this.namespace,
		fg1Open  = '\u001b[30m', //black
		fg1Close = '\u001b[39m',
		fg2Open  = '\u001b[31m', //red
		fg2Close = '\u001b[39m',
		bgOpen   = '\u001b[41m', //red
		bgClose  = '\u001b[49m';

	args[0] = '  '
		+ bgOpen
		+ fg1Open
		+ name
		+ fg1Close
		+ bgClose
		+ ' '
		+ args[0]
		+ fg2Open
		+ ' +'
		+ debug.humanize(this.diff)
		+ fg2Close;

	return args;
}
