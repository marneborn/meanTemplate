"use strict";

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Your initial config block
    grunt.initConfig({

        // Load the apps package.json, do it here so that it can be used as an object
        pkg     : grunt.file.readJSON('./package.json'),

        // maybe search %PATH% instead?
        nodemon : process.platform === 'win32'
            ? process.env.USERPROFILE+"\\AppData\\Roaming\\npm\\nodemon.cmd"
            : 'nodemon'

    });

    // Load your app specific tasks
    grunt.loadTasks('grunt');

};
