"use strict";

var pkg      = require('../package.json'),
    path     = require('path'),
    buildDef = require('../server/config/build-definitions'),
    builtDir = buildDef.destDir, // FIXME - from config later?

    gruntConfig = {

        clean: {
            "build": builtDir
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            options: {
                style: 'expanded'
            },
            dev : {
                files : {}
            }
        },

        watch: {
            'sass-dev': {},
            'buildDist': {}
        },

        focus: {
            'client-dev': {
                // Add sass watchers below
                include : ['sass-dev', 'livereload']
            }
        }
    };


gruntConfig.clean['built-css'] = [
    buildDef.appCss.dest,
    buildDef.appCss.dest+".map"
];

gruntConfig.sass.dev.files[buildDef.appCss.dest] = buildDef.appCss.src;

gruntConfig.watch['sass-dev'] = {
    options : {
        atBegin: true,
        event: ['changed', 'added']
    },
    files : buildDef.appCss.watch,
    tasks : ['clean:built-css', 'sass:dev']
};

module.exports = function(grunt) {
    grunt.config.merge(gruntConfig);
};
