"use strict";

// FIXME - imagemin, svgmin???
// FIXME - need to handle relative paths in .scss files? smart copy?

var buildDef = require('../server/config/build-definitions'),
    distDir = buildDef.destDir,
    annotated,
    gruntConfig = {

        clean: {
            "pre-build" : [distDir],
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
                files : {} }
        },

        watch: {
            'sass-dev': {},
            'buildDist': {}
        },
        build : {
            css:  ['clean:built-css', 'sass:dev'],
            dist: ['clean:pre-build', 'sass:dev', 'sass:dist', 'cssmin:dist', 'ngAnnotate:dist', 'uglify:dist', 'copy:bootstrap', 'clean:post-build']
        }

    };

//---------------------------------------------------------------------------
// Setup for sass build
gruntConfig.sass.dev.files[buildDef.appCss.dev]  = buildDef.appCss.src;
gruntConfig.sass.dev.options = {
    style: 'expanded'
};
gruntConfig.sass.dist.files[buildDef.appCss.dist] = buildDef.appCss.src;
gruntConfig.sass.dist.options = {
    style: 'compressed',
    sourcemap: 'none'
};
gruntConfig.cssmin.dist.files[buildDef.vendorCss.dist] = buildDef.vendorCss.src;
// FIXME - can this be autodetected? Or put in build-definitions?
gruntConfig.copy.bootstrap.files.push({
    expand: true,
    cwd: 'bower_components/bootstrap/dist',
    src: 'fonts/*',
    dest: distDir
});

// For auto sassing.
gruntConfig.clean['built-css'] = [
    buildDef.appCss.dev,
    buildDef.appCss.dev+".map"
];

gruntConfig.watch['sass-dev'] = {
    options : {
        atBegin: true,
        event: ['changed', 'added']
    },
    files : buildDef.appCss.watch,
    tasks : ['sass:dev']
};

//---------------------------------------------------------------------------
// setup for js build
annotated = buildDef.appJs.dist.replace(/(\.min)?\.js$/, '.ngAnn.js');
gruntConfig.clean['post-build'].push(annotated);

gruntConfig.ngAnnotate.dist.files[annotated] = buildDef.appJs.src;
gruntConfig.ngAnnotate.dist.options = {
    // FIXME - sourceMap not supported in many-to-one, is it needed in dist?
    //         to enable annotate each file separately then join in uglify.
    sourceMap : false
};

gruntConfig.uglify.dist.files[buildDef.appJs.dist]    = annotated;
gruntConfig.uglify.dist.files[buildDef.shimJs.dist]   = buildDef.shimJs.src;
gruntConfig.uglify.dist.files[buildDef.vendorJs.dist] = buildDef.vendorJs.src;
gruntConfig.uglify.dist.options = {
	mangle: false
};

//---------------------------------------------------------------------------
module.exports = function(grunt) {

    grunt.config.merge(gruntConfig);

    // sass, cssmin, and ngAnnotate+uglify can be concurrent, but probably not worth the overhead
    // run lint checks here?

    grunt.registerMultiTask('build', function() {
        grunt.log.writeln(this.target + ': ' + JSON.stringify(this.data));
        grunt.task.run(this.data);
    });
};
