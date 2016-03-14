"use strict";
const fs = require('fs');

//---------------------------------------------------------------------------
module.exports = function renameCfg (grunt) {

    grunt.registerMultiTask('rename', function() {
        grunt.log.writeln(this.target + ': ' + JSON.stringify(this.data));

        this.data.files.forEach(function (pair) {

            try {
                fs.statSync(pair.src[0]);
            }
            catch (err) {
                grunt.log.writeln("Source doesn't exist: "+pair.src[0]);
                return;
            }

            try {
                fs.renameSync(pair.src[0], pair.dest);
                grunt.log.ok('Renamed '+pair.src[0]+' to '+pair.dest);
            }
            catch (err) {
                grunt.log.error();
                grunt.verbose.error();
                grunt.fail.warn('Rename failed: '+pair.src[0]+' to '+pair.dest);
                throw err;
            }

        });

    });

};
