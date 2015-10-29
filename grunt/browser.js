"use strict";

/*
 * Tasks to help with web browser
 */

module.exports = function ( grunt ) {

	var opn = require('opn'),
        globule = require('globule'),
        _ = require('lodash'),
        config = require('../server/config'),
        buildDefs = globule.find('server/**/build-definitions.js'),
        gruntConfig = {
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
        },
        i, buildDef, distDir;

    for (i=0; i<buildDefs.length; i++) {

        buildDef = require('../'+buildDefs[i]);
        distDir = buildDef.distDir;

        Array.prototype.push.apply(
            gruntConfig.watch['sass-dev'].files,
            buildDef.appCss.watch
        );

        Array.prototype.push.apply(
            gruntConfig.watch.livereload.files,
            buildDef.appJs.src
        );
        gruntConfig.watch.livereload.files.push(
            buildDef.appCss.dev,
            buildDef.appCss.dist
        );
    }

    gruntConfig.watch.livereload.files.push('web/**/*.html');
    console.log(JSON.stringify(gruntConfig,null,4));
	grunt.config.merge(gruntConfig);

	grunt.task.registerTask('open-browser', 'open the browser to the front page', function (page) {

		var done = this.async();

		if (!page)
			page = '';

		opn("http://"+config.host+":"+config.port, done);
	});

    grunt.registerTask('dev-browser'  , ['open-browser', 'focus:dev-browser']);
    grunt.registerTask('watch-browser', ['open-browser', 'watch:livereload']);

};
