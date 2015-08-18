"use strict";

var path        = require('path'),
    _           = require('lodash'),
    consolidate = require('consolidate'),
    globule     = require('globule'),
    config      = require('./config'),
    buildDefs   = require('./config/build-definitions'),
    // FIXME - get these from a config somewhere
    staticDir   = "web/",
    viewsDir    = "web/views";  // relative to the root dir

module.exports = function (app) {

    var partials;

    app.engine("mustache", consolidate.mustache);
    app.set("views", viewsDir);
    app.set("view engine", "mustache");


    if (config.isPrd) {

        app.locals.googleAnalytics = true;
        app.locals.livereload = false;
        app.locals.shimJs     = [ buildDefs.shimJs.dist ].map(relativeToStatic);
        app.locals.vendorJs   = [ buildDefs.vendorJs.dist ].map(relativeToStatic);
        app.locals.vendorCss  = [ buildDefs.vendorCss.dist ].map(relativeToStatic);
        app.locals.appJs      = [ buildDefs.appJs.dist ].map(relativeToStatic);
        app.locals.appCss     = [ buildDefs.appCss.dist ].map(relativeToStatic);

    }

    else {

        app.locals.googleAnalytics = false;
        app.locals.livereload = true;
        app.locals.shimJs     = buildDefs.shimJs.src.map(relativeToStatic);
        app.locals.vendorJs   = buildDefs.vendorJs.src.map(relativeToStatic);
        app.locals.vendorCss  = buildDefs.vendorCss.src.map(relativeToStatic);
        app.locals.appJs      = buildDefs.appJs.src.map(relativeToStatic);
        app.locals.appCss     = [ buildDefs.appCss.dev ].map(relativeToStatic);

    }

    partials = findPartials();

    // FIXME - temporary
    app.use(function (req, res, next) {
        req.user = { name : "mikael" };
        next();
    });

    app.get("/", function (req, res) {
        res.render("index", {
            cache: false,
            user : req.user || {},
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
    .find("web/modules/**/*.partial.mustache")
    .map(function (file) {
        var name = path.basename(file, ".partial.mustache"),
            ptr = path.relative(viewsDir, file)
            .replace(/\\/g, "/")
            .replace(/\.mustache/, "");
        partials[name] = ptr;
    });

    return partials;
}

/**
 * Figure out what path should be put in the html so that .static can find it.
 * @param {String} file - The file, relative to cwd()
 * @return {String} The path that .static can find
 */
function relativeToStatic (file) {

    if (!file || !file.indexOf)
        return file;

    if (file.indexOf('bower_components') === 0)
        return file;

    return path.posix.relative(staticDir, file);
}
