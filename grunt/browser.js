"use strict";

/*
 * Tasks to help with web browser
 */

module.exports = function gruntBrowserCfg ( grunt ) {

    const opn = require('opn');
    let serverConfig;

    grunt.task.registerTask('prep-browser', function () {

        serverConfig = require('../server/config');

        let gruntConfig = {
            watch : {
                'sass-dev': {
                    files: [],
                    tasks: ['build:css']
                },
                livereload: {
                    files : [],
                    events: ['added', 'chagned'],
                    options: {
                        livereload: true
                    }
                }
            },
            focus: {
                'dev-browser': {
                    include: ['sass-dev', 'livereload']
                }
            }
        };

        for (let i=0; i<serverConfig.subApps.list.length; i++) {

            let subAppConfig = require('../server/'+serverConfig.subApps.list[i]+'/config');

            Array.prototype.push.apply(
                gruntConfig.watch['sass-dev'].files,
                subAppConfig.appCss.watch
            );

            Array.prototype.push.apply(
                gruntConfig.watch.livereload.files,
                subAppConfig.appJs.src
            );
            gruntConfig.watch.livereload.files.push(
                subAppConfig.appCss.dev,
                subAppConfig.appCss.dist
            );
        }

        gruntConfig.watch.livereload.files.push('web/**/*.html');
        grunt.config.merge(gruntConfig);
    });

    grunt.task.registerTask('open-browser', 'open the browser to the front page', function (page) {

        let done = this.async();

        if (!page)
            page = '';

        opn("http://"+serverConfig.host+":"+serverConfig.port, done);
    });

    grunt.registerTask('dev-browser'  , ['prep-browser', 'open-browser', 'build:css', 'focus:dev-browser']);
    grunt.registerTask('watch-browser', ['prep-browser', 'open-browser', 'watch:livereload']);

};
