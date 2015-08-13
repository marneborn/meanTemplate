"use strict";

var opn      = require('opn'),
    config   = require('../server/config'),
    buildDef = require('../server/config/build-definitions'),
    distDir  = 'web/dist'; // FIXME - get from config

module.exports = function ( grunt ) {

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
        }
    });


	grunt.task.registerTask('open-browser', 'open a browser', function (page) {

		var done = this.async();

		if (!page)
			page = '';

		opn("http://"+config.host+":"+config.port, done);
	});

	grunt.task.registerTask('client-dev', 'start the dev environment', function () {
	    grunt.task.run('open-browser');
        grunt.task.run('focus:client-dev');
    });

};
