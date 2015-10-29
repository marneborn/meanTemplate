'use strict';

// FIXME - helpers functions are probably common to all pages.

var path         = require('path'),
    fs           = require('fs'),
    _            = require('lodash'),
    wiredep      = require('wiredep'),
    wiredepRes   = wiredep(),
    globule      = require('globule'),
    rootDir      = path.join(__dirname, '../..'),
    subConfig    = require('./config'),
    thisDir      = 'web/'+subConfig.name,
    componentDir = 'web/components',
    distDir      = thisDir+'/dist',
    shims        = findShimJsFiles(),
    vendorMin    = false;

module.exports = {

    distDir : distDir,

    shimJs : { // FIXME - add watch for nodemon?
        dist : distDir+'/js/shims.min.js',
        src  : shims
    },

    vendorJs : { // FIXME - add watch for nodemon?
        dist : distDir+'/js/vendor.min.js',
        src  : findVendorJsFiles()
    },

    vendorCss : { // FIXME - add watch for nodemon
        dist : distDir+'/css/vendor.min.css',
        src  : findVendorCssFiles()
    },

    appJs : {
        dev  : distDir+'/js/'+subConfig.name+'.js',
        dist : distDir+'/js/'+subConfig.name+'.min.js',
        src  : findAppJsFiles()
    },

    appCss : {
        dev  : distDir+'/css/'+subConfig.name+'.css',
        dist : distDir+'/css/'+subConfig.name+'.min.css',
        src  : thisDir+'/'+subConfig.name+'.scss',
        watch: _.flatten([ // FIXME - can top.scss be parsed to get includes?
            thisDir+'/**/*.scss',
            subConfig.components.map(function (component) {
                return componentDir+'/'+component+'/**/*.scss';
            })
        ])
    }
};

/*
 * Hard code these scripts to get grouped together
 * FIXME - find based on 'es5' keyword in bower.json
 */
function findShimJsFiles () {
    return [
        'bower_components/es5-shim/es5-shim.min.js',
        'bower_components/json3/lib/json3.min.js'
    ];
}

/*
 * Create a list of all vendor js files, excluding shims.
 * FIXME - base on ones actually needed. How? maybe a bower.json for each page?
 */
function findVendorJsFiles () {

    return wiredepRes.js
    .map(function (file) {

        if (vendorMin) {
            var min = file.replace(/\.js$/, '.min.js');
            if (fs.existsSync(min))
                file = min;
        }

        return path.relative(rootDir, file).replace(/\\/g, '/');
    })
    .filter(function (file) {
        return shims.indexOf(file) < 0;
    });
}

/*
 * Create a list of all vendor css files
 */
function findVendorCssFiles () {

    return wiredepRes.css
    .map(function (file) {
        var min = file.replace(/\.css$/, '.min.css');
        if (fs.existsSync(min))
            file = min;
        return path.relative(rootDir, file).replace(/\\/g, '/');
    });
}

/*
 *
 */
function findAppJsFiles () {

    var i, j,
        types = [
            '/**/*.service.js',
            '/**/*.directive.js',
            '/**/*.routes.js',
            '/**/*.controller.js',
            '/**/*.js',
        ],
        dirs = _.flatten([
            thisDir,
            subConfig.components.map(function (component) {
                return componentDir+'/'+component;
            })
        ]),
        pats = [thisDir+'/'+subConfig.name+'.js'];

    for (j=0; j<types.length; j++) {
        for (i=0; i<dirs.length; i++) {
            pats.push(dirs[i]+types[j]);
        }
    }

    return globule.match(
        ['**/*', '!'+distDir+'/**/*'],
        globule.find(pats)
    );
}
