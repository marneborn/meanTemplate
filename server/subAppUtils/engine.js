"use strict";

// FIXME - There can probably be one common constructor for this for all pages

const path          = require('path'),
      _             = require('lodash'),
      consolidate   = require('consolidate'),
      globule       = require('globule'),
      mainConfig    = require('../config'),
      componentDir  = 'web/components';

module.exports = function (app, subConfig) {

    let thisDir  = 'web/'+subConfig.name,
          viewsDir = thisDir + '/views',  // relative to the root dir
          partials = findPartials(thisDir, componentDir, viewsDir);

    app.engine('mustache', consolidate.mustache);
    app.set('views', viewsDir);
    app.set('view engine', 'mustache');

    if (mainConfig.isPrd) {

        app.locals.googleAnalytics = true;
        app.locals.livereload = false;
        app.locals.shimJs     = [ subConfig.shimJs.dist    ].map(makeStaticURL);
        app.locals.vendorJs   = [ subConfig.vendorJs.dist  ].map(makeStaticURL);
        app.locals.vendorCss  = [ subConfig.vendorCss.dist ].map(makeStaticURL);
        app.locals.appJs      = [ subConfig.appJs.dist     ].map(makeStaticURL);
        app.locals.appCss     = [ subConfig.appCss.dist    ].map(makeStaticURL);

    }

    else {

        app.locals.googleAnalytics = false;
        app.locals.livereload = true;
        app.locals.shimJs     = subConfig.shimJs    .src.map(makeStaticURL);
        app.locals.vendorJs   = subConfig.vendorJs  .src.map(makeStaticURL);
        app.locals.vendorCss  = subConfig.vendorCss .src.map(makeStaticURL);
        app.locals.appJs      = subConfig.appJs     .src.map(makeStaticURL);
        app.locals.appCss     = [ subConfig.appCss.dev ].map(makeStaticURL);

    }

    app.get('/', function (req, res) {
        res.render('index', {
            cache: false,
            user : !req.user ? null : JSON.stringify(req.user.forClient(), null, 4),
            // FIXME - should fix this in consolidate...
            partials: _.cloneDeep(partials)
        });
    });

    return;

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

        // common components will be have url that starts with /components
        if (file.indexOf('web/components/') === 0) {
            return '/'+file.substr(4);
        }

        return path.posix.relative(thisDir, file);
    }

};

/*
 *
 */
function findPartials (thisDir, componentDir, viewsDir) {

    let partials = {};

    globule
    .find(
        thisDir+'/**/*.partial.mustache',
        componentDir+'/**/*.partial.mustache'
    )
    .map(function (file) {
        let name = path.basename(file, '.partial.mustache'),
            ptr = path.relative(viewsDir, file)
            .replace(/\\/g, '/')
            .replace(/\.mustache/, '');
        partials[name] = ptr;
    });

    return partials;
}
