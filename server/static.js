"use strict";

var express = require('express'),
	path    = require('path'),
	l       = require('./logger')('static'),

	// create and export the static router
	router = module.exports = express.Router();

// First simply look for the files using the basic static middleware
router.use(express.static(path.resolve('web')));
// common components are looked for with an absolute path and is relative to web/components
router.use(express.static(path.resolve('web/components')));
// testapp1 is the default, so need to find /testapp1/some/static and /some/static
router.use(express.static(path.resolve('web/testapp1')));

// vendor stuff is handled by bower
router.use(
    '/bower_components',
    express.static('./bower_components')
);

// for all .js and .css files that aren't found by the static route, return 404 with an empty body
router.use(/.*\.(js|css)$/, function (req, res) {
    l.debug("Request for a .js|.css that don't exits");
	res.status(404).end();
});

// for all .html files that aren't found by the static route, return the 404 page
// FIXME - for partials, should return empty?
router.use(/.*\.html/, function (req, res) {
    l.debug("Request for a .html that don't exits");
	res.status(404).sendFile(path.resolve('web/404.html'));
});
