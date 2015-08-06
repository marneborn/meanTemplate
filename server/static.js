"use strict";

var express = require('express'),
	path    = require('path'),
	l       = require('./logger')('static'),

	// create and export the static router
	router = module.exports = express.Router();

// First simply look for the files using the basic static middleware
router.use(express.static(path.resolve('web')));

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
// FIXME - handle partials
router.use(/.*\.html/, function (req, res) {
    l.debug("Request for a .html that don't exits");
	res.status(404).sendFile(path.resolve('web/404.html'));
});
