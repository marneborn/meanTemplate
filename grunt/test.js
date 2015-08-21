"use strict";

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
            unit: {
                // FIXME - do I really want to load all helpers in all tests?
                //         should probably split this up...
                //         or manually load the helpers that I want loaded. (Doing this now useHelpers:false)
                options: {
                    useHelpers: false
                },
                specs: [
                    "test/**/unit/**"
                ],
                helpers: [
                    "test/**/unit/**",
                    "test/common/**"
                ]
            }
        },
        watch: {
            'unit-tests' : {
                options : {
                    atBegin: true
                },
                files : [
                    '**/*.js',
                    '**/*.json',
                    '!node_modules/**/*',
                    '!bower_components/**/*',
                    // FIXME - to broad?
                    // FIXME - need to ignore non-unit test helpers and specs
                ],
                tasks: ['jasmine_nodejs:unit']
            }
        }
    });
};
