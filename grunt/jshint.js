"use strict";

module.exports = function(grunt) {

    var isDevel = !process.env.NODE_ENV || process.env.NODE_ENV === 'develop';

    grunt.config.merge({
        jshint: {
            options : {
                laxbreak: true,
                esnext: true,
                bitwise: true,
                camelcase: true,
                curly: false,
                eqeqeq: true,
                eqnull: true,
                immed: true,
                indent: 2,
                newcap: true,
                noarg: true,
                regexp: true,
                undef: true,
                unused: true,
                strict: true,
                trailing: true,
                smarttabs: true,
                latedef: "nofunc",
                devel: isDevel
            },
            web : {
                src: ['web/**/*.js', '!web/**/*-spec.js'],
                options: {
                    browser: true,
                    jquery: true,
                    globals: {
                        angular: true
                    }
                }
            },
            server : {
                src: ['server.js', 'routes/**/*.js', 'server/**/*.js', 'Gruntfile.js', 'grunt/**/*.js', '!server/**/*-spec.js'],
                options: {
                    node: true
                }
            },
            test : {
                src: ['**/*-spec.js'],
                options: {
                    jasmine: true
                }
            }
        },

        watch: {
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
            }
        },

        focus: {
            jshint: {
                include: ['jshint-web', 'jshint-server', 'jshint-test']
            }
        }

    });

    grunt.registerTask("jshintCoverage", "Check that all js files are checked by one of the jshint targets", function () {
        var allFiles = grunt.file.expand(["**/*.js", "!node_modules/**/*.js", "!bower_components/**/*.js"]),
            jshint   = grunt.config.get('jshint'),
            covered  = Array.prototype.concat.apply(
                [],
                Object.keys(jshint)
                .map(function (key) {

                    if (!jshint[key].src)
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
            grunt.log.ok("All .js files (not in node_modules and bower_components) are covered by jshint");

    });

};
