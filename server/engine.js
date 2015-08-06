"use strict";

var path        = require('path'),
    fs          = require('fs'),
    consolidate = require('consolidate'),
    wiredep     = require('wiredep'),
    globule     = require('globule'),
    viewsDir    = "./web/views",
    rootDir     = path.join(__dirname, "..");

module.exports = function (app) {

    var wiredepRes;

    app.engine("mustache", consolidate.mustache);
    app.set("views", viewsDir);
    app.set("view engine", "mustache");

    app.locals.livereload      = true;
    app.locals.googleAnalytics = false;

    app.locals.shimJs = findShimJsFiles();

    wiredepRes = wiredep();
    app.locals.vendorJs  = findVendorJSFiles (wiredepRes, app.locals.shimJs);
    app.locals.vendorCss = findVendorCssFiles(wiredepRes);

    app.locals.appJs  = findAppJsFiles();
    app.locals.appCss = findAppCssFiles();

    app.locals.partials = findPartials();

    // FIXME - temporary
    app.use(function (req, res, next) {
        req.user = { name : "mikael" };
        next();
    });

    app.get("/", function (req, res) {
        res.render("index", { user : req.user || {} });
    });

    return;
};

/*
 *
 */
function findShimJsFiles () {
    return [
        "bower_components/es5-shim/es5-shim.min.js",
        "bower_components/json3/lib/json3.min.js"
    ];
}

/*
 *
 */
function findVendorJSFiles (wiredepRes, excludeList) {

    return wiredepRes.js
    .map(function (file) {
        var min = file.replace(/\.js$/, ".min.js");
        if (fs.existsSync(min))
            file = min;
        return path.relative(rootDir, file).replace(/\\/g, "/");
    })
    .filter(function (file) {
        return excludeList.indexOf(file) < 0;
    });
}

/*
 *
 */
function findVendorCssFiles (wiredepRes) {
    return wiredepRes.css
    .map(function (file) {
        var min = file.replace(/\.css$/, ".min.css");
        if (fs.existsSync(min))
            file = min;
        return path.relative(rootDir, file).replace(/\\/g, "/");
    });
}

/*
 *
 */
function findAppJsFiles () {

    return Array.prototype.concat.call(
        ["app/app.js"],
        globule.find("app/**/*.*.js"             , {srcBase: "web"}),
        globule.find("modules/**/*.module.js"    , {srcBase: "web"}),
        globule
        .find("modules/**/*.js", {srcBase: "web"})
        .filter(function (file) {
            return !file.match(/module.js$/);
        })
    );

}

/*
 *
 */
function findAppCssFiles () {
    return [
        "builtCss/main.css"
    ];
}


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
