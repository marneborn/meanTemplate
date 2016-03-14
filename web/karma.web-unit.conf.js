"use strict";

// Karma configuration
// Generated on Tue Apr 21 2015 10:55:45 GMT-0700 (Pacific Daylight Time)

var path = require('path'),
    _ = require('lodash'),
    config = require('../server/config'),
    subAppConfigs = {};

config.subApps.list.forEach(function (subAppName) {
    subAppConfigs[subAppName] = require('../server/'+subAppName+'/config');
});

module.exports = function(config) {

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: getFiles(),

        // list of files to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN
        //               || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        //browsers: ['Chrome', 'Firefox', 'IE'],
        browsers: ['Chrome'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};

/*
 *
 */
function fromAllSubApps (group, type) {

    return Array.prototype.concat.apply(
        [],
        config.subApps.list.map(function (name) {
            return subAppConfigs[name][group][type];
        })
    );
}

/*
 *
 */
function getFiles () {
    var type = process.env.NODE_ENV === 'production' ? 'dist' : 'src',
        mapping;

    if (type === 'dist') {
        mapping = require('../filerev-mapping.json');
    }

    return _.unique(Array.prototype.concat.call(
        [],
        fromAllSubApps('shimJs', type),
        fromAllSubApps('vendorJs', type),
        [
            'bower_components/angular-mocks/angular-mocks.js',
        ],
        [
            'web/components/setupApp.js'
        ],
        fromAllSubApps('appJs', type),
        [
            'web/**/*.spec.js'
        ]
    ))
        .map(function (rel) {
            if (type === 'dist' && mapping[rel] != null) {
                return mapping[rel];
            }
            return rel;
        })
        .map(function (rel) {
            return path.resolve(rel);
        });
}
