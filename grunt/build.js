"use strict";

module.exports = function(grunt) {

    grunt.config.merge({

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: 'web/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: 'web/images',
                javascriptsDir: 'web/scripts',
                fontsDir: 'web/styles/fonts',
                importPath: './bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            dev: {
                options: {
                    debugInfo: true
                }
            }
        }

    });
};
