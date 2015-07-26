"use strict";

module.exports = function(grunt) {

    grunt.config.merge({
        jshint: {
            options : {
                eqnull : true,
                laxbreak: true
            },
            web : {
                src: ['web/**/*.js'],
                options: {
                    globals: {
                        jQuery: true
                    }
                }
            },
            server : {
                src: ['server.js', 'routes/**/*.js', 'server/**/*.js']
            }
        },

        watch: {
            'jshint-web' : {
                files: '<%= jshint.web.src %>',
                tasks: ['jshint:web']
            },
            'jshint-server' : {
                files: '<%= jshint.server.src %>',
                tasks: ['jshint:server']
            }
        }
    });
};
