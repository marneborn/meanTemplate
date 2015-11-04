"use strict";

var fs = require('fs'),
    _ = require('lodash'),
    minimatch = require("minimatch");

/*
 * Tasks to help with web browser
 */

module.exports = function ( grunt ) {

    grunt.config.merge({
        'jasmine_nodejs': {

            options: {
                specNameSuffix: "spec.js",
                helperNameSuffix: "helper.js",
                useHelpers: false,
                stopOnFailure: false,
                // configure one or more built-in reporters
                reporters: {
                    console: {
                        colors: true,
                        cleanStack: 1,       // (0|false)|(1|true)|2|3
                        verbosity: 4,        // (0|false)|1|2|3|(4|true)
                        listStyle: "indent", // "flat"|"indent"
                        activity: false
                    },
                    // junit: {
                    //     savePath: "./reports",
                    //     filePrefix: "junit-report",
                    //     consolidate: true,
                    //     useDotNotation: true
                    // },
                    // nunit: {
                    //     savePath: "./reports",
                    //     filename: "nunit-report.xml",
                    //     reportName: "Test Results"
                    // },
                    //terminal: {
                    //     color: false,
                    //    showStack: false,
                    //     verbosity: 2
                    //},
                    // teamcity: true,
                    // tap: true
                },
                // add custom Jasmine reporter(s)
                customReporters: []
            },
            'server-unit': {
                // FIXME - do I really want to load all helpers in all tests?
                //         should probably split this up...
                //         or manually load the helpers that I want loaded. (Doing this now useHelpers:false)
                options: {
                    useHelpers: false
                },
                specs: [
                    "test/server/**/unit/**"
                ],
                helpers: [
                    "test/server/**/unit/**",
                    "test/common/**"
                ]
            }
        },
        watch: {
            'server-unit' : {
                options : {
                    atBegin: true
                },
                files : _.flattenDeep([
                    // In lieu of ['**/*.js', '!node_modules/**/*']
                    // which is slow (until my glob fixes bubble up to grunt watch)
                    buildFilesList(process.cwd(), [
                        '#*#',
                        '*~',
                        '.git',
                        '.sass-cache',
                        'node_modules',
                        'bower_components',
                        'notes',
                        'web',
                        'scripts'
                    ])
                    .map(function (use) {
                        if (fs.statSync(use).isDirectory()) {
                            return [use+"/**/*.js", use+"/**/*.json"];
                        }
                        else if (use.match(/\.js(on)?$/)) {
                            return use;
                        }
                        else {
                            return [];
                        }
                    })
                ]),
                tasks: ['jasmine_nodejs:server-unit']
            }
        },
        focus: {
            test : {
                // FIXME - this should probably have a reporter that only summarizes (unless fails)
                //         so that all tests can be seen.
                include : ['server-unit']
            }
        }

    });

    grunt.registerTask('dev-test', 'focus:test');

    /*
     *
     */
    function buildFilesList (dir, exclude) {
        var kids = fs.readdirSync(dir);
        return kids.filter(function (kid) {
            for (var i=0; i<exclude.length; i++) {
                if (minimatch(kid, exclude[i])) {
                    return false;
                }
            }
            return true;
        });
    }
};
