"use strict";

// FIXME - imagemin, svgmin???
// FIXME - need to handle relative paths in .scss files? smart copy?

const fs = require('fs');

//---------------------------------------------------------------------------
/* jshint -W071 */
module.exports = function gruntBuildCfg (grunt) {
/* jshint -W072 */

    const serverConfig = require('../server/config'),

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

              concat: {
                  options: {
                      separator: ';\n'
                  }
              },

              copy: {
                  bootstrap : { files: [] },
                  "merge-build": {
                      files: []
                  }
              },

              ngAnnotate: {
// FIXME - want implicit matching?
//                   options: {
//                       regexp : "^.*registerModule(.*)$"
//                   },
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
                  ann:  [
                      'clean:pre-build',
                      'sass:dev', 'sass:dist', 'cssmin:dist',
                      'ngAnnotate:dist', 'concat*', 'copy:bootstrap'
                  ],
                  dist: [
                      'clean:save-build', 'rename:save-build',
                      'sass:dev', 'sass:dist', 'cssmin:dist',
                      'ngAnnotate:dist', 'uglify:dist', 'concat*', 'copy:bootstrap',
                      'clean:ngAnn', 'filerev:dist', 'dump-filerev-dist',
                      'copy:merge-build', 'clean:save-build'
                  ]
              }

          };


    let concatIdx  = 0,
        annOffset  = gruntConfig.build.ann.indexOf('concat*'),
        distOffset = gruntConfig.build.dist.indexOf('concat*');

    for (let i=0; i<serverConfig.subApps.list.length; i++) {

        let subAppName = serverConfig.subApps.list[i],
            subAppConfig = serverConfig.subApps[subAppName];

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
        let annotated = subAppConfig.appJs.dist.replace(/(\.min)?\.js$/, '.ngAnn.js');
        gruntConfig.clean.ngAnn.push(annotated);

        gruntConfig.ngAnnotate.dist.files[annotated] = subAppConfig.appJs.src;
        gruntConfig.ngAnnotate.dist.options = {
            sourceMap : false
        };

        //---------------------------------------------------------------------------
        gruntConfig.uglify.dist.files[subAppConfig.appJs.dist]    = annotated;

        //---------------------------------------------------------------------------
        gruntConfig.concat['concat'+concatIdx] = {
            src  : subAppConfig.shimJs.src,
            dest : subAppConfig.shimJs.dist
        };
        gruntConfig.build.ann.splice (concatIdx+annOffset , 0, 'concat:concat'+concatIdx);
        gruntConfig.build.dist.splice(concatIdx+distOffset, 0, 'concat:concat'+concatIdx);
        concatIdx++;

        //---------------------------------------------------------------------------
        gruntConfig.concat['concat'+concatIdx] = {
            src  : subAppConfig.vendorJs.src,
            dest : subAppConfig.vendorJs.dist
        };
        gruntConfig.build.ann.splice (concatIdx+annOffset , 0, 'concat:concat'+concatIdx);
        gruntConfig.build.dist.splice(concatIdx+distOffset, 0, 'concat:concat'+concatIdx);
        concatIdx++;
    }

    gruntConfig.build.ann .splice(concatIdx+annOffset , 1);
    gruntConfig.build.dist.splice(concatIdx+distOffset, 1);

    grunt.config.merge(gruntConfig);

    grunt.registerTask('dump-filerev-dist', function () {
        let file = './filerev-mapping.json',
              newmapping = {},
              keys = Object.keys(grunt.filerev.summary);

        for (let i=0; i<keys.length; i++) {
            let newsrc  = keys[i].replace(/\\/g, '/');
            let newdest = grunt.filerev.summary[keys[i]].replace(/\\/g, '/');
            newmapping[newsrc] = newdest;
        }
        fs.writeFileSync(file, JSON.stringify(newmapping, null, 2));
    });

    grunt.registerMultiTask('build', function() {
        grunt.log.writeln(this.target + ': ' + JSON.stringify(this.data));
        grunt.task.run(this.data);
    });

};
