"use strict";

var path        = require('path'),
    _           = require('lodash'),
    consolidate = require('consolidate'),
    globule     = require('globule'),
    buildDefs   = require('./config/build-definitions'),
    // FIXME - get these from a config somewhere
    staticDir   = "web/",
    viewsDir    = "web/views";  // relative to the root dir

console.log("---\n"+JSON.stringify(buildDefs, null, 4));
module.exports = function (app) {

    var partials;

    app.engine("mustache", consolidate.mustache);
    app.set("views", viewsDir);
    app.set("view engine", "mustache");

    app.locals.livereload      = true;
    app.locals.googleAnalytics = false;

    if (process.env.NODE_ENV === 'production') {

        app.locals.shimJs    = [ buildDefs.shimJs.dest ].map(relativeToStatic);
        app.locals.vendorJs  = [ buildDefs.vendorJs.dest ].map(relativeToStatic);
        app.locals.vendorCss = [ buildDefs.vendorCss.dest ].map(relativeToStatic);
        app.locals.appJs     = [ buildDefs.appJs.dest ].map(relativeToStatic);
        app.locals.appCss    = [ buildDefs.appCss.dist ].map(relativeToStatic);

    }

    else {

        app.locals.shimJs    = buildDefs.shimJs.src.map(relativeToStatic);
        app.locals.vendorJs  = buildDefs.vendorJs.src.map(relativeToStatic);
        app.locals.vendorCss = buildDefs.vendorCss.src.map(relativeToStatic);
        app.locals.appJs     = buildDefs.appJs.src.map(relativeToStatic);
        app.locals.appCss    = [ buildDefs.appCss.dest ].map(relativeToStatic);

    }
    console.log("appCss> "+JSON.stringify(app.locals.appCss, null, 4));
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

    if (file.indexOf('bower_components') === 0)
        return file;

    return path.posix.relative(staticDir, file);
}
