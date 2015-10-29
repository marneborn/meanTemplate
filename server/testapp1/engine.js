"use strict";

// FIXME - There can probably be one common constructor for this for all pages

var path          = require('path'),
    _             = require('lodash'),
    consolidate   = require('consolidate'),
    globule       = require('globule'),
    config        = require('../config'),
    buildDefs     = require('./build-definitions'),

    subConfig     = require('./config'),
    thisDir       = 'web/'+subConfig.name,
    componentDir  = 'web/components',
    viewsDir      = thisDir + '/views';  // relative to the root dir

module.exports = function (app) {

    var partials;

    app.engine('mustache', consolidate.mustache);
    app.set('views', viewsDir);
    app.set('view engine', 'mustache');

    if (config.isPrd) {

        app.locals.googleAnalytics = true;
        app.locals.livereload = false;
        app.locals.shimJs     = [ buildDefs.shimJs.dist    ].map(makeStaticURL);
        app.locals.vendorJs   = [ buildDefs.vendorJs.dist  ].map(makeStaticURL);
        app.locals.vendorCss  = [ buildDefs.vendorCss.dist ].map(makeStaticURL);
        app.locals.appJs      = [ buildDefs.appJs.dist     ].map(makeStaticURL);
        app.locals.appCss     = [ buildDefs.appCss.dist    ].map(makeStaticURL);

    }

    else {

        app.locals.googleAnalytics = false;
        app.locals.livereload = true;
        app.locals.shimJs     = buildDefs.shimJs    .src.map(makeStaticURL);
        app.locals.vendorJs   = buildDefs.vendorJs  .src.map(makeStaticURL);
        app.locals.vendorCss  = buildDefs.vendorCss .src.map(makeStaticURL);
        app.locals.appJs      = buildDefs.appJs     .src.map(makeStaticURL);
        app.locals.appCss     = [ buildDefs.appCss.dev ].map(makeStaticURL);

    }

    partials = findPartials();

    app.get('/', function (req, res) {
        res.render('index', {
            cache: false,
            user : !req.user ? null : JSON.stringify(req.user.forClient(), null, 4),
            // FIXME - should fix this in consolidate...
            partials: _.cloneDeep(partials)
        });
    });

    return;
};

/*
 *
 */
function findPartials () {

    var partials = {};

    globule
    .find(
        thisDir+'/**/*.partial.mustache',
        componentDir+'/**/*.partial.mustache'
    )
    .map(function (file) {
        var name = path.basename(file, '.partial.mustache'),
            ptr = path.relative(viewsDir, file)
            .replace(/\\/g, '/')
            .replace(/\.mustache/, '');
        partials[name] = ptr;
    });

    return partials;
}

/**
 * Figure out the relative path to this file
 * @param {String} file - The file, relative to cwd()
 * @return {String} The path that .static can find
 */
function makeStaticURL (file) {

    if (!file || !file.indexOf)
        return file;

    // all apps share one bower_components
    if (file.indexOf('bower_components/') === 0) {
        return '/'+file;
    }

    if (file.indexOf('web/components/') === 0) {
        return file.substr(4);
    }

    return path.posix.relative(thisDir, file);
}
