'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    globule = require('globule'),
    BPromise = require('bluebird'),
    mongoose = require('mongoose'),
    config = require('./config'),
    mtUtils = require('./utils'),
    uri = mtUtils.makeMongoURI(config.db),
    L = require('./logger')('db');

globule.find(['models/**/*.js']).forEach(function (file) {
    L.debug("Adding model: "+file);
    require(path.resolve(file));
});

var opened = module.exports = new BPromise(function (resolve, reject) {

    mongoose.connection
    .once('connecting', connecting)
    .once('open', resolveIt)
    .once('error', rejectIt);

    function connecting () {
        process.once('SIGINT', disconnectIt);
    }

    function disconnectIt () {
	    mongoose.disconnect(function () {
		    L.log('Disconnecting from mongoose due to SIGINT');
            process.emit('SIGINT');
        });
    }

    function resolveIt () {
        resolve(mongoose.connection);
        mongoose.connection.removeListener('error', rejectIt);
        mongoose.connection
        .on('error', function (err) {
            L.err("Got an error: "+err);
        })
        .on('disconnected', function () {
            L.warn("Lost connection to: "+mongoose.connection.host+":"+mongoose.connection.port);
        })
        .on('reconnected', function () {
            L.warn("Regained connection to: "+mongoose.connection.host+":"+mongoose.connection.port);
        });
    }

    function rejectIt (err) {
        reject(err);
        mongoose.connection.removeListener('open', resolveIt);
        process.removeListener('SIGINT', disconnectIt);
    }

});

mongoose.connect(uri);

opened
.catch(function (err) {
    L.err(err.msg+"\n"+err.stack);
    process.exit();
});
