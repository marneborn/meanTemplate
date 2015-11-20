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

            'server-unit': {
                // FIXME - do I really want to load all helpers in all tests?
                //         should probably split this up...
                //         or manually load the helpers that I want loaded. (Doing this now useHelpers:false)
                options: {
                    useHelpers: false
                },
                specs: [
                    "test/server-unit/**"
                ],
                helpers: [
                    "test/server-unit/**",
                    "test/common/**"
                ]
            }
        },

        karma: {
			'web-watch': {
				configFile: 'test/web-unit/karma.conf.js'
			},
			'web-once': {
				configFile: 'test/web-unit/karma.conf.js',
				options : {
					singleRun: true
				}
			},
			'web-full': {
				configFile: 'test/web-unit/karma.conf.js',
				options: {
					browsers: ['Chrome', 'Firefox', 'IE'],
					singleRun: true
				}
			}
		},

        watch: {
            'server-unit' : {
                options : {
                    atBegin: true
                },
                files : ['server.js', 'server/**/*.js', 'test/server-unit/**/*', '!**/#*.js'],
                tasks: ['jasmine_nodejs:server-unit']
            }
        },
        focus: {
            'server-tests' : {
                // FIXME - this should probably have a reporter that only summarizes (unless fails)
                //         so that all tests can be seen.
                include : ['server-unit', ]
            }
        }
    });

    grunt.registerTask('dev-server-tests', 'focus:server-tests');
    grunt.registerTask('dev-web-tests', 'karma:web-watch');

};
