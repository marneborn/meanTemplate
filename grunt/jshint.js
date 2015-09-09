"use strict";

var _ = require('lodash'),
    fs = require('fs');

module.exports = function(grunt) {

    var allMyJS = getAllMyJS(['node_modules', 'bower_components', '.git', '.sass-cache']),
        jshintConfig = {
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
                devel: !process.env.NODE_ENV || process.env.NODE_ENV === 'develop'
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
            // When only rerunning the particular jshint subtask that had a change other sub tasks
            // errors get lost, so rerun all on any change.
            'dev-jshint': {
                options: {
                    // need nospawn for grunt.option('force') to propogate to task run by watch
                    nospawn: true,
                    atBegin: true
                },
                files: allMyJS,
                tasks: ['jshint-all']
            }
        };


    grunt.config.merge({
        jshint: jshintConfig,
        watch: watchConfig
    });

    grunt.registerTask("dev-jshint", "watch:dev-jshint");

    grunt.registerTask("jshint-all", function () {
        grunt.option("force", true);
        grunt.task.run(
            Object.keys(jshintConfig)
            .filter(function (k) { return k !== 'options'; })
            .map   (function (k) { return 'jshint:'+k; })
            .concat('jshint-coverage')
        );
    });

    grunt.registerTask("jshint-coverage", "Check that all js files are checked by one of the jshint targets", function () {

        var jshint   = grunt.config.get('jshint'),
            covered  = Array.prototype.concat.apply(
                [],
                Object.keys(jshint)
                .map(function (key) {

                    if (key === 'options')
                        return [];

                    return grunt.file.expand(jshint[key].src);
                })
            ),
            expected   = grunt.file.expand(allMyJS),
            notcovered = _.difference(expected, covered),
            extra      = _.difference(covered, expected);

        if (notcovered.length === 0) {
            grunt.log.ok("All .js files (excluding vendor) are covered by jshint");
        }
        else {
            grunt.log.error("Files not covered by jshint");
            grunt.log.error(":   "+notcovered.join("\n:   ")+"\n");
        }

        if (extra.length !== 0) {
            grunt.log.error("Number of files jshint-ed, but not written by us: "+extra.length+" (use --verbose for list)");
            grunt.log.verbose(":   "+extra.join("\n:   ")+"\n");
        }

        return;
    });
};

/*
 *
 */
function getAllMyJS (excludeDir) {
    return _.flattenDeep(
        [
            "*.js",
            fs.readdirSync(process.cwd())
            .filter(function (thing) {
                if (fs.statSync(thing).isDirectory()) {
                    return excludeDir.indexOf(thing) < 0;
                }
                return false;
            })
            .map(function (thing) {
                return thing+"/**/*.js";
            }),
            "!web/dist/**/*.js"
        ]
    );
}
