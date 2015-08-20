"use strict";

module.exports = function(grunt) {

    var isDevel = !process.env.NODE_ENV || process.env.NODE_ENV === 'develop',
        jshintConfig = {
            options : {
                strict: true,
                trailing: true,
                smarttabs: true,
                latedef: "nofunc",
                devel: isDevel
            },
            web : {
                // FIXME - get web/dist from config
                src: ['web/**/*.js', '!web/dist/**/*'],
                options: {
                    browser: true,
                    jquery: true,
                    globals: {
                        angular: true
                    }
                }
            },
            server : {
                src: ['server.js', 'routes/**/*.js', 'server/**/*.js', 'models/**/*.js'],
                options: {
                    node: true
                }
            },
            grunt: {
                src: ['Gruntfile.js', 'grunt/**/*.js'],
                options: {
                    node: true
                }
            },
            test : {
                src: ['test/**/*.js'],
                options: {
                    jasmine: true,
                    node:true
                }
            }
        },
        watchConfig = {
            'jshint-web' : {
                options: {
                    atBegin: true
                },
                files: '<%= jshint.web.src %>',
                tasks: ['jshint:web']
            },
            'jshint-server' : {
                options: {
                    atBegin: true
                },
                files: '<%= jshint.server.src %>',
                tasks: ['jshint:server']
            },
            'jshint-test' : {
                options: {
                    atBegin: true
                },
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test']
            },
            'jshint-coverage' : {
                options: {
                    atBegin: true
                },
                files: ["**/*.js", "!node_modules/**/*.js", "!bower_components/**/*.js"],
                tasks: ['jshint-coverage']
            }
        };

    grunt.config.merge({
        jshint: jshintConfig,
        watch: watchConfig,
        focus: {
            jshint: {
                include: Object.keys(watchConfig)
            }
        }

    });

    grunt.registerTask("jshint-coverage", "Check that all js files are checked by one of the jshint targets", function () {
        var watch    = grunt.config.get('watch'),
            allFiles = grunt.file.expand(watch['jshint-coverage'].files),
            jshint   = grunt.config.get('jshint'),
            covered  = Array.prototype.concat.apply(
                [],
                Object.keys(jshint)
                .map(function (key) {

                    if (key === 'options')
                        return [];

                    return grunt.file.expand(jshint[key].src);
                })
            ),
            num = 0,
            i;

        for (i = 0; i < allFiles.length; i++) {

            if (covered.indexOf(allFiles[i]) >= 0)
                continue;

            if (num === 0)
                grunt.log.error("Files not covered by jshint");

            num++;
            grunt.log.error(":   "+allFiles[i]);
        }

        if (num === 0)
            grunt.log.ok("All .js files (excluding vendor) are covered by jshint");

    });

};
