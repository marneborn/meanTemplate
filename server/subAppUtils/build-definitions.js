"use strict";

const path         = require('path'),
      fs           = require('fs'),
      _            = require('lodash'),
      wiredep      = require('wiredep'),
      globule      = require('globule'),
      rootDir      = path.join(__dirname, '../..'),
      componentDir = 'web/components',
      commonDir    = 'common';

let filerevMapping;

try {
    filerevMapping = require('../../filerev-mapping');
}
catch (err) {
    if (err.message === "Cannot find module '../../filerev-mapping'") {
        filerevMapping = {};
    }
    else {
        throw err;
    }
}

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
            dist : distDir+'/js/shims.min.js',
            reved: filereved(distDir+'/js/shims.min.js'),
            src  : shims
        },

        vendorJs : { // FIXME - add watch for nodemon?
            dist : distDir+'/js/vendor.min.js',
            reved: filereved(distDir+'/js/vendor.min.js'),
            src  : findVendorJsFiles()
        },

        vendorCss : { // FIXME - add watch for nodemon
            dist : distDir+'/css/vendor.min.css',
            reved: filereved(distDir+'/css/vendor.min.css'),
            src  : findVendorCssFiles()
        },

        appJs : {
            dist : distDir+'/js/'+subConfig.name+'.min.js',
            reved: filereved(distDir+'/js/'+subConfig.name+'.min.js'),
            src  : findAppJsFiles()
        },

        appCss : {
            dev  : distDir+'/css/'+subConfig.name+'.css',
            dist : distDir+'/css/'+subConfig.name+'.min.css',
            reved: filereved(distDir+'/css/'+subConfig.name+'.min.css'),
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
            'bower_components/es5-shim/es5-shim.min.js',
            'bower_components/json3/lib/json3.min.js'
        ];
    }

    /*
     * Create a list of all vendor js files, excluding shims.
     * FIXME - base on ones actually needed. How? maybe a bower.json for each page?
     * FIXME - ignore shim if not loading .min.js's
     */
    function findVendorJsFiles () {

        return wiredepRes.js
            .map(function (file) {

                if (subConfig.vendorMin) {
                    let min = file.replace(/\.js$/, '.min.js');
                    if (fs.existsSync(min))
                        file = min;
                }

                return path.relative(rootDir, file).replace(/\\/g, '/');
            })
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

    function filereved (from) {
        return filerevMapping[from]  !== undefined ? filerevMapping[from] : from;
    }
}
