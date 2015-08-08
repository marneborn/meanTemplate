"use strict";

var path        = require('path'),
    fs          = require('fs'),
    _           = require('lodash'),
    wiredep     = require('wiredep'),
    globule     = require('globule'),
    rootDir     = path.join(__dirname, "../.."),
    builtDir    = 'web/built', // FIXME - put in a config somewhere
    wiredepRes  = wiredep(),
    shims       = findShimJsFiles();

module.exports = {

    destDir : builtDir,

    shimJs : {
        dest : builtDir+'/shims.js',
        src  : shims
    },

    vendorJs : { // FIXME - add watch?
        dest : builtDir+'/vendor.js',
        src  : findVendorJsFiles(wiredepRes.js, shims)
    },

    vendorCss : { // FIXME - add watch?
        dest : builtDir+'/vendor.css',
        src  : findVendorCssFiles(wiredepRes.css)
    },

    appJs : {
        dest : builtDir+'/app.js',
        src  : findAppJsFiles(),
        watch: ['web/**/*.js']
    },

    appCss : {
        dest : builtDir+'/app.css',
        src  : 'web/app/app.scss',
        watch: ["web/**/*.scss"]
    }
};

/*
 * Hard code these scripts to get grouped together
 */
function findShimJsFiles () {
    return [
        "bower_components/es5-shim/es5-shim.min.js",
        "bower_components/json3/lib/json3.min.js"
    ];
}

/*
 * Find all
 */
function findVendorJsFiles (files, excludeList) {

    var munged = files
    .map(function (file) {
        var min = file.replace(/\.js$/, ".min.js");
        if (fs.existsSync(min))
            file = min;
        return path.relative(rootDir, file).replace(/\\/g, "/");
    });

    if (!excludeList)
        return munged;

    return munged.filter(function (file) {
        return excludeList.indexOf(file) < 0;
    });
}

/*
 *
 */
function findVendorCssFiles (files, excludeList) {

    var munged = files
    .map(function (file) {
        var min = file.replace(/\.css$/, ".min.css");
        if (fs.existsSync(min))
            file = min;
        return path.relative(rootDir, file).replace(/\\/g, "/");
    });

    if (!excludeList)
        return munged;

    return munged.filter(function (file) {
        return excludeList.indexOf(file) < 0;
    });
}

/*
 *
 */
function findAppJsFiles () {
    return _.union(
        ["web/app/app.js"],
        globule.find("web/app/**/*.js"),
        globule.find("web/modules/**/*.module.js"),
        globule.find("web/**/*.js")
    );
}
