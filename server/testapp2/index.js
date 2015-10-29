"use strict";

var path = require('path'),
    _ = require('lodash'),
    globule = require('globule'),
    BPromise = require('bluebird'),
    express = require('express'),
    subConfig = require('./config'),
    components = ['user'],
    thisDir = 'server/'+subConfig.name,
	L = require('../logger')(subConfig.name),
    app = express();

module.exports = app;

L.debug("Starting app");

globule.find(
    thisDir+'/**/*.routes.js'
)
.forEach(function (file) {
    L.debug("Adding routes from: "+file);
    app.use(require(path.resolve(file)));
});

require('./engine')(app);

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
