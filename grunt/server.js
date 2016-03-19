"use strict";

const path = require('path'),
      defaultEnvVars = {
          NODE_ENV: 'development',
          DEBUG: '*,-send,-connect:dispatcher,-express:router*,-express:application,-body-parser:*',
          DEBUG_COLOR: 1,
          PASSDOWN_EMAIL: null,
          PASSDOWN_SMTP: null
      };

module.exports = function gruntServerCfg ( grunt ) {

    grunt.registerTask('dev-server', function () {

        const watchWeb = grunt.option('watch-web'),
              config = {
                  nodemon: {
                      dev: {
                          script: 'server.js',
                          options: {
                              restartable: "rs",
                              args: [],
                              env: buildEnvVars(),
                              cwd: path.resolve(__dirname, '..'),
                              ext: 'js',
                              verbose: true,
                              ignore: [
                                  '/.git$',
                                  '/node_modules$',
                                  '/bower_components$',
                                  '/.sass-cache$',
                                  '/grunt$',
                                  '/logs$'
                              ],
                              watch: [
                                  'server.js',
                                  'server/**/*.js',
                                  'web/*/dist/js/**/*.js',
                                  'web/*/dist/css/**/*.css',
                                  '!server/**/*.spec.js',
                                  '!server/**/*.spec-helper.js',
                              ],
                              delay: 1000
                          }
                      }
                  }
              };

        if (watchWeb == null || watchWeb) {
            // Need to watch stuff in web to update list of js and css files included by render
            // FIXME - really only care about 'added' and 'removed' for client scripts,
            //         not sure if that is possible
            // FIXME - Need to be more specific? What doesn't need to be in here?
            config.nodemon.dev.options.watch.push(
                'web/**/*.js',
                '!web/**/*.spec.js',
                'web/**/*.css',
                'web/**/*.view.mustache'
            );
        }

        if (grunt.option('production')) {
            config.nodemon.dev.options.args.push('--production');
        }

        grunt.config.merge(config);
        grunt.task.run('nodemon:dev');
    });

    function buildEnvVars () {
        const keys = Object.keys(defaultEnvVars),
              env = {};

        for (let i=0; i<keys.length; i++) {

            // simply copy if it's set
            if (process.env[keys[i]] != null) {
                env[keys[i]] = process.env[keys[i]];
            }

            // set if default is not null
            else if (defaultEnvVars[keys[i]] !== null) {
                env[keys[i]] = defaultEnvVars[keys[i]];
            }
        }

        return env;
    }
};
