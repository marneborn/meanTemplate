"use strict";

// FIXME - imagemin, svgmin???
// FIXME - need to handle relative paths in .scss files? smart copy?

var globule = require('globule');

//---------------------------------------------------------------------------
module.exports = function(grunt) {

    var serverConfig = require('../server/config'),

        gruntConfig = {

            clean: {
                "pre-build" : [],
                "post-build": []
            },

            sass: {
                dev  : { files : {} },
                dist : { files : {} }
            },

            cssmin: {
                dist : { files : {} }
            },

            copy: {
                bootstrap : { files: [] }
            },

            ngAnnotate: {
                dist : { files : {} }
            },

            uglify: {
                dist : {
                    files : {}
                }
            },

            build : {
                css:  ['clean:built-css', 'sass:dev'],
                dist: ['clean:pre-build', 'sass:dev', 'sass:dist', 'cssmin:dist', 'ngAnnotate:dist', 'uglify:dist', 'copy:bootstrap', 'clean:post-build']
            }

        },
        annotated, i, subAppConfig;

    for (i=0; i<serverConfig.subApps.list.length; i++) {

        subAppConfig = require('../server/'+serverConfig.subApps.list[i]+'/config');

        //---------------------------------------------------------------------------
        gruntConfig.clean['pre-build'].push(subAppConfig.distDir);

        //---------------------------------------------------------------------------
        // Setup for sass build
        gruntConfig.sass.dev.files[subAppConfig.appCss.dev]  = subAppConfig.appCss.src;
        gruntConfig.sass.dev.options = {
            style: 'expanded'
        };
        gruntConfig.sass.dist.files[subAppConfig.appCss.dist] = subAppConfig.appCss.src;
        gruntConfig.sass.dist.options = {
            style: 'compressed',
            sourcemap: 'none'
        };

        gruntConfig.cssmin.dist.files[subAppConfig.vendorCss.dist] = subAppConfig.vendorCss.src;

        // FIXME - can this be autodetected? Or put in config
        gruntConfig.copy.bootstrap.files.push({
            expand: true,
            cwd: 'bower_components/bootstrap/dist',
            src: 'fonts/*',
            dest: subAppConfig.distDir
        });

        // For auto sassing.
        gruntConfig.clean['built-css'] = [
            subAppConfig.appCss.dev,
            subAppConfig.appCss.dev+".map"
        ];

        //---------------------------------------------------------------------------
        // setup for js build
        annotated = subAppConfig.appJs.dist.replace(/(\.min)?\.js$/, '.ngAnn.js');
        gruntConfig.clean['post-build'].push(annotated);

        gruntConfig.ngAnnotate.dist.files[annotated] = subAppConfig.appJs.src;
        gruntConfig.ngAnnotate.dist.options = {
            sourceMap : false
        };

        //---------------------------------------------------------------------------
        gruntConfig.uglify.dist.files[subAppConfig.appJs.dist]    = annotated;
        gruntConfig.uglify.dist.files[subAppConfig.shimJs.dist]   = subAppConfig.shimJs.src;
        gruntConfig.uglify.dist.files[subAppConfig.vendorJs.dist] = subAppConfig.vendorJs.src;
        gruntConfig.uglify.dist.options = {
	        mangle: false
        };

    }

    grunt.config.merge(gruntConfig);

    // sass, cssmin, and ngAnnotate+uglify can be concurrent, but probably not worth the overhead
    // run lint checks here?

    grunt.registerMultiTask('build', function() {
        grunt.log.writeln(this.target + ': ' + JSON.stringify(this.data));
        grunt.task.run(this.data);
    });

};
