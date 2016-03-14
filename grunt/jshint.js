"use strict";

const _ = require('lodash'),
      fs = require('fs');

module.exports = function gruntJshintCfg (grunt) {

    const allMyJS = getAllMyJS(),
          jshintConfig = {
              options : {

                  maxerr : 9999,

                  // Enforcing options
                  // When set to true, these options will make JSHint produce more warnings about your code.
                  bitwise : true,
                  camelcase : false,
                  curly : false,
                  eqeqeq : true,
                  forin : true,
                  freeze : true,
                  futurehostile : true,
                  immed : true,
                  indent : true,
                  iterator : true,
                  latedef : "nofunc", // OK to define functions late, but not variables
                  maxcomplexity : 8,
                  maxdepth : 4,
                  maxlen : 110,
                  maxparams : 4,
                  maxstatements : 25,
                  newcap : true,
                  noarg : true,
                  nocomma : true,
                  noempty : false, // OK to have explicit empty blocks like : {}
                  nonbsp : true,
                  nonew : true,
                  quotmark : false,
                  shadow : true,
                  singleGroups : true,
                  strict  : true,
                  undef : true,
                  unused : true,

                  // Relaxing options
                  // When set to true, these options will make JSHint produce fewer warnings about your code.
                  asi : false,
                  boss : false,
                  debug : false,
                  elision : false,
                  eqnull : true,
                  esnext : false,
                  evil : false,
                  expr : false,
                  globalstrict : false,
                  lastsemic : false,
                  laxbreak : true, // Allow things like '.', '+', '||' at start of continued line
                  laxcomma : true, // Allow comma at start of next line instead of end of previous.
                  loopfunc : false,
                  moz : false,
                  multistr : false,
                  noyield : false,
                  plusplus : false,
                  proto : false,
                  scripturl : false,
                  sub : false,
                  supernew : false,
                  validthis : false,
                  withstmt : false,

                  // Environment
                  // These options let JSHint know about some pre-defined global variables.
                  devel: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

              },
              web : {
                  // FIXME - get web/dist from config
                  src: ['web/**/*.js', '!web/**/dist/**/*', '!web/**/*.spec.js', '!web/karma.*.conf.js'],
                  options: {
                      browser: true,
                      globals: {
                          angular: true,
                          Symbol: true
                      }
                  }
              },
              server : {
                  src: ['server.js', 'server/**/*.js', '!server/**/*.spec.js', '!server/**/*.spec-helper.js'],
                  options: {
                      node: true,
                      esversion: 6
                  }
              },
              common : {
                  src: ['common/**/*.js'],
                  options: {
                      browser: true,
                      node: true,
                      esversion: 5,
                      globals: {
                          angular: true,
                          Symbol: true
                      }
                  }
              },
              grunt: {
                  src: ['Gruntfile.js', 'grunt/**/*.js'],
                  options: {
                      node: true
                  }
              },
              'server-unit' : {
                  src: ['server/**/*.spec.js', 'server/**/*.spec-helper.js'],
                  options: {
                      jasmine: true,
                      esversion: 6,
                      node:true
                  }
              },
              'karma-conf': {
                  src: ['web/karma.*.conf.js'],
                  options: {
                      jasmine:true,
                      esversion: 6,
                      node:true
                  }
              },
              'web-unit' : {
                  src: ['web/**/*.spec.js'],
                  options: {
                      jasmine: true,
                      globals: {
                          window: true,
                          jasmine: true,
                          node: true,
                          inject: true,
                          angular: true,
                          document: true,
                          module: true,
                          setTimeout: true
                      }
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
                  tasks: ['print-break', 'jshint-all']
              }
          };

    grunt.registerTask("count-jshint-files", function () {
        Object.keys(jshintConfig).forEach(function (target) {
            if (target === 'options') {
                return;
            }
            let start = new Date(),
                files = grunt.file.expand(jshintConfig[target].src),
                end   = new Date();
            grunt.log.ok(target+" - "+files.length+" files - "+(end-start)+" seconds to find");
        });
    });

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

    grunt.registerTask(
        "jshint-coverage",
        "Check that all js files are checked by one of the jshint targets",
        function () {

            const jshint   = grunt.config.get('jshint'),
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
                grunt.log.error(
                    "Number of files jshint-ed, but not written by us: "
                        +extra.length
                        +" (use --verbose for list)"
                );
                grunt.log.verbose(":   "+extra.join("\n:   ")+"\n");
            }

            return;
        }
    );
};

/*
 *
 */
function getAllMyJS () {

    const excludeDir = [
        'node_modules', 'bower_components', '.git', '.sass-cache', 'scripts'
    ];

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
            "!web/**/dist/**/*.js",
            "!secrets/**/*",
            "!secrets.js"
        ]
    );
}
