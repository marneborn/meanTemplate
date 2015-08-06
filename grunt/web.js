"use strict";

/*
 * Tasks to help with web browser
 */

module.exports = function ( grunt ) {

	var opn = require('opn');
    var config = require('../server/config');

    grunt.task.registerTask('openBrowser', 'open a browser', function (page) {

        this.async();

        if (!page)
            page = '';
        opn("http://127.0.0.1:"+config.port+"/");
    });

	grunt.config.merge({
		watch: {
            devWeb : {
                files : [ "web/**/*" ],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.registerTask('devWeb', ['openBrowser', 'watch:devWeb']);
};
