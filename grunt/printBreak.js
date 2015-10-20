"use strict";

module.exports = function(grunt) {
    grunt.registerTask('print-break', function () {
        grunt.log.ok(new Array(75).join("=")+"\n");
    });
};
