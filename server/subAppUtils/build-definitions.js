"use strict";

const path         = require('path'),
      fs           = require('fs'),
      _            = require('lodash'),
      wiredep      = require('wiredep'),
      globule      = require('globule'),
      rootDir      = path.join(__dirname, '../..'),
      buildConfig  = require('../config/build'),
      utils        = require('../utils'),
      componentDir = 'web/components',
      commonDir    = 'common';

module.exports = buildDefinitions;

/*
 *
 */
function buildDefinitions (subConfig) {

    let thisDir      = subConfig.thisDir,
        distDir      = 'web/'+subConfig.name+'/dist',
        wiredepRes   = wiredep(),
        shims        = findShimJsFiles();

    return {

        distDir : distDir,

        shimJs : { // FIXME - add watch for nodemon?
            dist : distDir+'/js/shims.js',
            src  : shims.map(vendorMin)
        },

        vendorJs : { // FIXME - add watch for nodemon?
            dist : distDir+'/js/vendor.js',
            src  : findVendorJsFiles().map(vendorMin)
        },

        vendorCss : { // FIXME - add watch for nodemon
            dist : distDir+'/css/vendor.css',
            src  : findVendorCssFiles()
        },

        appJs : {
            dist : distDir+'/js/'+subConfig.name+'.js',
            src  : findAppJsFiles()
        },

        appCss : {
            dev  : distDir+'/css/'+subConfig.name+'.css',
            dist : distDir+'/css/'+subConfig.name+'.min.css',
            src  : thisDir+'/'+subConfig.name+'.scss',
            watch: _.flatten([ // FIXME - can top.scss be parsed to get includes?
                thisDir+'/**/*.scss',
                componentDir+'/sass/**/*.scss', // FIXME - should this always be included?
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
            'bower_components/es5-shim/es5-shim.js',
            'bower_components/json3/lib/json3.js'
        ];
    }

    /*
     *
     */
    function vendorMin (file) {

        if (!buildConfig.vendorMin) {
            return file;
        }

        let min = file.replace(/\.js$/, '.min.js');
        if (utils.fileExists(min)) {
            return min;
        }
        return file;
    }

    /*
     *
     */
    function forwardSlash (file) {
        return path.relative(rootDir, file).replace(/\\/g, '/');
    }

    /*
     * Create a list of all vendor js files, excluding shims.
     * FIXME - base on ones actually needed. How? maybe a bower.json for each page?
     * FIXME - ignore shim if not loading .min.js's
     */
    function findVendorJsFiles () {
        return wiredepRes.js
            .map(forwardSlash)
            .filter(function (file) {
                // Force exclusion of bootstrap.js file because we don't have jquery...
                if  (file.match(/\/bootstrap(?:\.min)?\.js/)) {
                    return false;
                }
                if (shims.indexOf(file) >= 0) {
                    return false;
                }
                return true;
            });
    }

    /*
     * Create a list of all vendor css files
     */
    function findVendorCssFiles () {

        return !wiredepRes || !wiredepRes.css ? [] : wiredepRes.css
            .map(function (file) {
                let min = file.replace(/\.css$/, '.min.css');
                if (fs.existsSync(min))
                    file = min;
                return path.relative(rootDir, file).replace(/\\/g, '/');
            });
    }

    /*
     *
     */
    function findAppJsFiles () {
        let all,
            types = [ // FIXME - is order actually important, angular is Lazy isn't it?
                '/**/*.service.js',
                '/**/*.directive.js',
                '/**/*.routes.js',
                '/**/*.controller.js',
                '/**/*.js'
            ],
            dirs = _.flatten([
                thisDir,
                !subConfig.components ? [] : subConfig.components.map(function (module) {
                       return componentDir+'/'+module;
                })
            ]),
            pats = [
                componentDir+'/setupApp.js',
                thisDir+'/'+subConfig.name+'.js'
            ];

        for (let j=0; j<types.length; j++) {
            for (let i=0; i<dirs.length; i++) {
                pats.push(dirs[i]+types[j]);
            }
        }

        all = globule.match(
            [
                '**/*',
                '!'+distDir+'/**/*',
                '!**/*.spec.js'
            ],
            globule.find(pats)
        );

        if (subConfig.common) {
            Array.prototype.push.apply(
                all,
                subConfig.common.map(function (module) {
                    return commonDir+'/'+module+".js";
                })
            );
        }

        return all;
    }
}
