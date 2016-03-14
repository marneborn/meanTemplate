"use strict";

// FIXME - imagemin, svgmin???
// FIXME - need to handle relative paths in .scss files? smart copy?

var fs = require('fs');

//---------------------------------------------------------------------------
module.exports = function gruntBuildCfg (grunt) {

    var serverConfig = require('../server/config'),

        gruntConfig = {

            clean: {
                "pre-build" : ['filerev-mapping.json', 'web/*/dist/**/*'],
                "save-build" : ['web/*/dist.save/**/*'],
                "ngAnn": [],
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
                bootstrap : { files: [] },
                "merge-build": {
                    files: []
                }
            },

            ngAnnotate: {
                dist : { files : {} }
            },

            uglify: {
                dist : {
                    files : {}
                }
            },

            filerev: {
                dist: {
                    src: [
                        'web/*/dist/**/*.js',
                        'web/*/dist/**/*.css'
                    ]
                }
            },

            rename: {
                'save-build': {
                    files: []
                }
            },

            build : {
                css:  ['clean:pre-build', 'sass:dev'],
                dist: [
                    'clean:save-build', 'rename:save-build',

                    'sass:dev', 'sass:dist', 'cssmin:dist',
                    'ngAnnotate:dist', 'uglify:dist', 'copy:bootstrap',

                    'clean:ngAnn', 'filerev:dist', 'dump-filerev-dist',
                    'copy:merge-build', 'clean:save-build'
                ]
            }

        },
        annotated, i, subAppConfig;

    for (i=0; i<serverConfig.subApps.list.length; i++) {

        subAppConfig = require('../server/'+serverConfig.subApps.list[i]+'/config');

        //---------------------------------------------------------------------------
        gruntConfig.clean['pre-build'].push(subAppConfig.distDir);

        //---------------------------------------------------------------------------
        // Save previous builds off (will merge later)
        gruntConfig.clean['save-build'].push(subAppConfig.distDir+'.save');
        gruntConfig.rename['save-build'].files.push({
            src:  subAppConfig.distDir,
            dest: subAppConfig.distDir+'.save'
        });
        gruntConfig.copy['merge-build'].files.push({
            expand: true,
            cwd: subAppConfig.distDir+'.save',
            src:  ['**'],
            dest: subAppConfig.distDir+'/'
        });


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
            cwd: 'bower_components/bootstrap-css',
            src: 'fonts/*',
            dest: subAppConfig.distDir
        });

        //---------------------------------------------------------------------------
        // setup for js build
        annotated = subAppConfig.appJs.dist.replace(/(\.min)?\.js$/, '.ngAnn.js');
        gruntConfig.clean.ngAnn.push(annotated);

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

    grunt.registerTask('dump-filerev-dist', function () {
        var file = './filerev-mapping.json',
            newmapping = {},
            keys = Object.keys(grunt.filerev.summary),
            i, newsrc, newdest;

        for (i=0; i<keys.length; i++) {
            newsrc  = keys[i].replace(/\\/g, '/');
            newdest = grunt.filerev.summary[keys[i]].replace(/\\/g, '/');
            newmapping[newsrc] = newdest;
        }
        fs.writeFileSync(file, JSON.stringify(newmapping, null, 2));
    });

    grunt.registerMultiTask('build', function() {
        grunt.log.writeln(this.target + ': ' + JSON.stringify(this.data));
        grunt.task.run(this.data);
    });

};
