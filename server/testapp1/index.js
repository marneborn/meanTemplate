"use strict";

const path = require('path'),
      globule = require('globule'),
      express = require('express'),
      subConfig = require('./config'),
      name = subConfig.name,
      thisDir = 'server/'+name,
      L = require('../logger')(name),
      app = express();

module.exports = {
    app : app
};

L.debug("Starting app");

globule.find(
    thisDir+'/**/*.routes.js'
)
    .forEach(function (file) {
        L.debug("Adding routes from: "+file);
        app.use(require(path.resolve(file)));
    });

require('../subAppUtils/engine')(app, subConfig);

// The very last thing is to send 404
app.use(require('../404'));
