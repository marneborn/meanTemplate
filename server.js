"use strict";

var express = require('express'),
    http = require('http'),
    https = require('https'),
    url = require('url'),
    fs = require('fs'),
    path = require('path'),
    globule = require('globule'),
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
    mongooseDB = require('./server/mongooseDB'),
    dbConnection,

    // server components to put at the top
    userComponent = require('./server/components/user'),

    // Keep track of initialization promises to hold off promises
    initPromises = [],

    // declare local variables.
    defaultApp, subAppName, subApp, opts, i;

// Connect to the common mongooseDB
dbConnection = mongooseDB.connect();
initPromises.push(dbConnection);

// Setup the user component
initPromises.push(
    userComponent.init({
        mongooseDB : dbConnection
    })
);

require('./server/logIncoming')(app);

app.use(require('./server/static'));

// Parse the request to put the cookie on req.cookie
app.use(cookieParser());

// Wait for the body of the request and put it on req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// add passport middleware
app.use(userComponent.authenticate(config.sessions));

// add middleware defining each sub app
for (i=0; i<config.subApps.list.length; i++) {
    subAppName = config.subApps.list[i];
    subApp = require('./server/'+subAppName);

    L.debug('Adding sub-app : '+subAppName);
    app.use('/'+subAppName, subApp.app);

    if (subApp.init) {
        initPromises.push(subApp.init());
    }
}

// Common component routes are common for all sup-apps.
// This is correct for things like '/auth/google/callback', but is it always true?
for (i=0; i<config.components.length; i++) {
    globule.find('server/components/'+config.components[i]+'/**/*.routes.js')
    /* jshint -W083 */
    .forEach(function (file) {
        L.debug('Adding routes from: '+file);
        app.use(require(path.resolve(file)));
    });
    /* jshint +W083 */
}

L.debug('Setting default app to be '+config.subApps.default);
defaultApp = require('./server/'+config.subApps.default);
app.use(function (req, res, next) {
    if (fromDefaultPage(req)) {
        defaultApp.app(req, res, next);
    }
    else {
        next();
    }
});

// The very last thing is to send 404
app.use(require('./server/404'));

// don't start listening until all the subApps inits are done.
BPromise
.all(initPromises)
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

/*
 * Check that the referrer is the default page, ie "/"
 */
function fromDefaultPage (req) {

    if (!req.headers || !req.headers.referer) {
        return true;
    }

    var parsed = url.parse(req.headers.referer);
    return parsed.path === '/';
}
