"use strict";

/*
 * Tasks to help with web browser
 */

module.exports = function gruntTestCfg ( grunt ) {
    const MyReporter = require('./test/MyReporter'),
          myReporter = new MyReporter();

    grunt.config.merge({
        'jasmine_nodejs': {

            options: {
                specNameSuffix: ".spec.js",
                helperNameSuffix: ".spec-helper.js",
                useHelpers: false,
                stopOnFailure: false,
                // configure one or more built-in reporters
                reporters: {
//                     console: {
//                         colors: true,
//                         cleanStack: 1,       // (0|false)|(1|true)|2|3
//                         verbosity: 4,        // (0|false)|1|2|3|(4|true)
//                         listStyle: "indent", // "flat"|"indent"
//                         activity: false
//                     },
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
                customReporters: [
                    myReporter
                ]
            },

            'server-unit': {
                // FIXME - do I really want to load all helpers in all tests?
                //         should probably split this up...
                //         or manually load the helpers that I want loaded. (Doing this now useHelpers:false)
                options: {
                    useHelpers: false
                },
                specs: [
                    // FIXME - differentiate between node and angular tests in common?
                    "server/**", "common/**"
                ],
                helpers: [
                    "server/**", "common/**"
                ]
            }
        },

        karma: {
            'web-watch': {
                configFile: 'web/karma.web-unit.conf.js',
                options: {}
            },
            'web-once': {
                configFile: 'web/karma.web-unit.conf.js',
                options : {
                    singleRun: true
                }
            },
            'web-full': {
                configFile: 'web/karma.web-unit.conf.js',
                options: {
                    browsers: ['Chrome', 'Firefox', 'IE'],
                    singleRun: true
                }
            }

        },

        protractor: {
            options: {
                configFile: 'e2e/conf.js'
            },
            all: {
                options: {
                    keepAlive: false,
                    noColor: false
                }
            },
            watch: {
                options: {
                    keepAlive: true,
                    noColor: false
                }
            }
        },
        watch: {
            'e2e-tests': {
                options: {
                    atBegin: true
                },
                files: [
                    'e2e/**/*.js',
                    'server.js',
                    'server/**/*.js', 'server/**/#*.js',
                    'common/**/*.js', 'common/**/#*.js',
                    'web/**/*.js', 'web/**/#*.js'
                ],
                tasks: ['protractor:all']
            },
            'server-unit' : {
                options : {
                    atBegin: true
                },
                files : [
                    'server.js',
                    'server/**/*.js', 'server/**/#*.js',
                    'common/**/*.js', 'common/**/#*.js'
                ],
                tasks: ['jasmine_nodejs:server-unit']
            }
        },
        focus: {
            'server-tests' : {
                // FIXME - this should probably have a reporter that only summarizes (unless fails)
                //         so that all tests can be seen.
                include : ['server-unit']
            }
        }
    });

    grunt.registerTask('prd-web-tests', function () {
        process.env.NODE_ENV = 'production';
        grunt.task.run('karma:web-full');
    });
    grunt.registerTask('dev-server-tests', 'focus:server-tests');
    grunt.registerTask('dev-web-tests', function () {
        process.env.NODE_ENV = undefined;
        grunt.task.run('karma:web-full');
    });
    grunt.registerTask('watch-web-tests', function () {
        process.env.NODE_ENV = undefined;
        grunt.task.run('karma:web-watch');
    });

    // FIXME - start webdriver here?
    grunt.registerTask('dev-e2e-tests', 'protractor:watch');
    grunt.registerTask('prd-e2e-tests', 'protractor:all');
};
