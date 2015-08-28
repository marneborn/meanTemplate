"use strict";

module.exports = function(grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Load the apps package.json, do it here so that it can be used as an object
	var pkg = grunt.file.readJSON('./package.json');

	// Your initial config block
	grunt.initConfig({
		pkg     : pkg,
		// maybe search %PATH% instead?
		nodemon : (process.platform === 'win32')
			? process.env.USERPROFILE+"\\AppData\\Roaming\\npm\\nodemon.cmd"
			: 'nodemon'

	});

	// Load your app specific tasks
	grunt.loadTasks('grunt');

};
