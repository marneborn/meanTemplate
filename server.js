"use strict";

var express = require('express'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    path = require('path'),
    globule = require('globule'),
    _ = require('lodash'),
    BPromise = require('bluebird'),

    // uses debug module to print messages to screen if DEBUG contains 'server'
	L = require('./server/logger')('server'),

    // Load the configuration
	config  = require('./server/config'),

	// express middleware
	cookieParser = require('cookie-parser'),
	bodyParser   = require('body-parser'),

	// Create the express app
	app = express(),

    // Setup to connect to the DB
    db = require('./server/db'),
    dbPromise = db.connect(),

    // declare local variables.
    opts, i;

require('./server/logIncoming')(app);

app.use(require('./server/static'));

// Parse the request to put the cookie on req.cookie
// FIXME - move these to the individual routers that need them
app.use(cookieParser());

// Wait for the body of the request and put it on req.body
// FIXME - move these to the individual routers that need them
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./server/components/user/authenticate')(app, config.sessions);

// handle component routes here.
// They should be absolute so won't get into the app specific middleware
globule.find('server/components/**/*.routes.js')
.forEach(function (file) {
    L.debug('Adding routes from: '+file);
    app.use(require(path.resolve(file)));
});

for (i=0; i<config.subApps.list.length; i++) {
    L.debug('Adding sub-app : '+config.subApps.list[i]);
    app.use('/'+config.subApps.list[i], require('./server/'+config.subApps.list[i]));
}

L.debug('Setting default app to be '+config.subApps.default);
app.get('/', require('./server/'+config.subApps.default));

// The very last thing is to send 404
app.use(function (req, res) {
    L.debug('Unhandled request: '+req.url+' - '+JSON.stringify(req.headers));
	res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.resolve('web/404.html'));
    }
    else if (req.accepts('json')) {
        res.json({ error : 'not a valid endpoint: '+req.url });
    }
    else {
        res.end();
    }
});

// don't start listening until all the subApps inits are done.
BPromise
.all([
    dbPromise,
])
.then(startListening)
.catch(function (err) {
    L.fatal("Couldn't start listener: "+err);
});


/*
 *
 */
function startListening () {

    if ( config.port ) {
	    http.createServer(app).listen(config.port, function () {
		    L.log("HTTP Express server listening on port " + config.host + ':' +config.port);
	    });
    }

    if ( config.sport) {
	    opts = config2sslOptions(config);
	    https.createServer(opts, app).listen(config.sport, function() {
		    L.log("HTTPS Express server listening on sport " + config.host + ':' +config.sport);
	    });
    }
}

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
