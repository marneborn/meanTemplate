"use strict";

module.exports = function(grunt) {

    var sassBuilds = {
        main : {
            src : 'web/main/main.scss',
            dest: 'web/builtCss/main.css'
        }
    };

    var config = {

        clean: {
            "sass": 'web/builtCss'
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            options: {
                style: 'expanded'
            }
            // rest Build programatically from file list above
        },

        watch: {
            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    'web/**/*.html',
                    'web/builtCss/*.css',
                    'web/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    'web/**/*.js'
                ]
            }
            // Build sassBuild tasks programatically from file list above
        },

        focus: {
            webDev: {
                include : ['livereload'] // Add sass watchers below
            }
        }
    };

    Object.keys(sassBuilds).forEach(function (name) {

        // one sass task per group so that we don't need to rebuild all on watch
        config.sass[name] = { files : {} };
        config.sass[name].files[sassBuilds[name].dest] = sassBuilds[name].src;

        var thisName = "sass-"+name;

        config.clean[thisName] = sassBuilds[name].dest;

        config.watch[thisName] = {
            files : sassBuilds[name].src,
            tasks : ['clean:'+thisName, 'sass:'+name]
        };

        config.focus.webDev.include.push(thisName);
    });

    grunt.config.merge(config);
};
