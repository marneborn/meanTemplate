"use strict";

var path     = require('path');

module.exports = function ( grunt ) {
	grunt.config.merge({
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
				    restartable: "rs",
				    args: [],
				    env: {
					    DEBUG: '*,-send,-connect:dispatcher',
					    DEBUG_COLOR: 1
				    },
				    cwd: path.resolve(__dirname, '..'),
				    ext: 'js',
                    verbose: true,
				    watch: [
                        'server.js',
                        'server/**/*.js',
                        'routes/**/*.js',
                        'models/**/*.js',
                        // Need to watch stuff in web to update list of js and css files included by render
                        // FIXME - really only care about 'added' and 'removed' for client scripts, not sure if that is possible
                        // FIXME - Need to be more specific? What doesn't need to be in here?
                        'web/**/*.js',
                        'web/**/*.css',
                        'web/**/*.parial.mustache',
                        // FIXME - figure out how to make **/test/** not look in node_modules and bower_components, probably needs a nodemon fix
                        '!**/test/**',
                        '!grunt/**/*'
                    ],
				    delay: 1000
				}
			}
		}
	});

    grunt.registerTask('dev-server', ['nodemon:dev']);
};
