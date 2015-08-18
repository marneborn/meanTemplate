'use strict';
/**
 * Module dependencies.
 */
var path = require('path'),
    globule = require('globule'),
    config = require('./config'),
    serverUtils = require('./utils'),
    mongoose = require('mongoose'),
	chalk = require('chalk');

var uri = serverUtils.makeMongoURI(config.db),
    db  = mongoose.connect(uri, function(err) {
	    if (err) {
		    console.error(chalk.red('Could not connect to MongoDB!')+' ' +uri);
		    console.log(chalk.red(err));
	    }
    });

globule.find(['./models/**/*.js']).forEach(function (file) {
    require(path.resolve(file));
});
