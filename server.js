"use strict";

const express = require('express'),
      http = require('http'),
      https = require('https'),
      fs = require('fs'),
      path = require('path'),
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

      // Keep track of initialization promises to hold off promises
      initPromises = [];

require('./server/logIncoming')(app);

app.use(require('./server/static'));

// Parse the request to put the cookie on req.cookie
app.use(cookieParser());

// Wait for the body of the request and put it on req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//add passport middleware
initPromises.push(
    require('./server/user')(app)
);

// add middleware defining each sub app
for (let i=0; i<config.subApps.list.length; i++) {
    let subAppName = config.subApps.list[i];
    L.debug('Adding sub-app : "'+subAppName+'"');

    let subApp = require('./server/'+subAppName);
    if (subApp.init) {
        initPromises.push(subApp.init());
    }

    app.use('/'+subAppName, subApp.app);
}

if (config.subApps.default) {
    L.log("Using "+config.subApps.default+" as the default app");
    let subApp = require('./server/'+config.subApps.default);
    app.use('/', subApp.app);
}

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
        let opts = config2sslOptions(config);
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
        key:    fs.readFileSync(path.resolve(process.cwd(), config.sslOptions.key)).toString(),
        cert:    fs.readFileSync(path.resolve(process.cwd(), config.sslOptions.cert)).toString()
    };

    if (config.sslOptions.passphrase)
        sslOptions.passphrase = config.sslOptions.passphrase;

    if (config.sslOptions.ca.length) {
        sslOptions.ca = [];
        for (let ca = 0; ca < config.sslOptions.ca.length; ca++) {
            sslOptions.ca.push(
                fs.readFileSync(path.resolve(process.cwd(), config.sslOptions.ca[ca]))
                    .toString()
            );
        }
    }

    return sslOptions;
}
