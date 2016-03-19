"use strict";

const express = require('express'),
      path    = require('path'),
      L       = require('./logger')('static'),
      config  = require('./config'),

      // create and export the static router
      router = module.exports = express.Router();

// First simply look for the files using the basic static middleware
// sub-app specific stuff should be found here.
// They are relative to the sub-app directory
router.use(express.static(path.resolve('web')));

// Want to be able to find stuff in the default app without the appname in the url
router.use(express.static(path.resolve('web/'+config.subApps.default)));

// find things common to server and web
router.use(
    '/common',
    express.static(path.resolve('common'))
);
router.use(express.static(path.resolve('web/components')));

// find web components
router.use(
    '/components',
    express.static(path.resolve('web/components'))
);
router.use(express.static(path.resolve('web/components')));

// vendor stuff is handled by bower
router.use(
    '/bower_components',
    express.static(path.resolve('bower_components'))
);

// for all .js and .css files that aren't found by the static route, return 404 with an empty body
router.use(/.*\.(js|css)$/, function (req, res) {
    L.debug("Request for a .js|.css that don't exist");
    res.status(404).end();
});

// for all .html files that aren't found by the static route, return the 404 page
// FIXME - for partials, should return empty?
router.use(/.*\.html/, function (req, res) {
    L.debug("Request for a .html that don't exist");
    res.status(404).sendFile(path.resolve('web/404.html'));
});
