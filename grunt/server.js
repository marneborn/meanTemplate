"use strict";

var path = require('path');

module.exports = function ( grunt ) {
	grunt.config.merge({
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
				    restartable: "rs",
				    args: [],
				    env: {
					    DEBUG: process.env.DEBUG || '*,-send,-connect:dispatcher,-express:router*',
					    DEBUG_COLOR: 1
				    },
				    cwd: path.resolve(__dirname, '..'),
				    ext: 'js',
                    verbose: true,
                    ignore: [
                        '/.git$',
                        '/node_modules$',
                        '/bower_components$',
                        '/.sass-cache$',
                        '/grunt$'
                    ],
				    watch: [
                        'server.js',
                        'server/**/*.js',
                        // Need to watch stuff in web to update list of js and css files included by render
                        // FIXME - really only care about 'added' and 'removed' for client scripts,
                        //         not sure if that is possible
                        // FIXME - Need to be more specific? What doesn't need to be in here?
                        'web/**/*.js',
                        'web/**/*.css',
                        'web/**/*.view.mustache'
                    ],
				    delay: 1000
				}
            }
        }
	});

    grunt.registerTask('dev-server', ['nodemon:dev']);
};
