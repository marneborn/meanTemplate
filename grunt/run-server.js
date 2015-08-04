"use strict";

var path    = require('path');

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
					watch: ['server.js', 'server/**/*.js', 'routes/**/*.js'],
					delay: 1000
				}
			}
		}
	});
};
