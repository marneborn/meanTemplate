"use strict";

/*
 * Tasks to help with web browser
 */

module.exports = function ( grunt ) {

	var opn = require('opn'),
        config = require('../server/config'),
        buildDef = require('../server/config/build-definitions'),
        distDir  = 'web/dist'; // FIXME - get from config

	grunt.config.merge({
		watch: {
            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    'web/**/*.html',
                    'web/**/*.mustache',
                    'web/**/*.{png,jpg,jpeg,gif,webp,svg}',
                    buildDef.appCss.dev,
                    buildDef.appJs.watch,
                    '!'+distDir+'/**/*.js'
                ]
            }
        },

        focus: {
            'dev-browser': {
                // Add sass watchers below
                include : ['sass-dev', 'livereload']
            }
        }

    });

	grunt.task.registerTask('open-browser', 'open the browser to the front page', function (page) {

		var done = this.async();

		if (!page)
			page = '';

		opn("http://"+config.host+":"+config.port, done);
	});

    grunt.registerTask('dev-browser'  , ['open-browser', 'focus:dev-browser']);
    grunt.registerTask('watch-browser', ['open-browser', 'watch:livereload']);

};
