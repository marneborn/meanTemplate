"use strict";

/**
 * Module dependencies.
 * FIXME - Should probably be a constructor to allow multiple mongooseDBs in the same app.
 */
var path = require('path'),
    globule = require('globule'),
    BPromise = require('bluebird'),
    mongoose = require('mongoose'),
    config = require('../config'),
    mongoUtils = require('../mongoDB/utils'),
    uri = mongoUtils.makeMongoURI(config.db),
    L = require('../logger')('mongooseDB'),
    promise = null;

module.exports = {
    connect: connect
};

function connect () {

    if (promise)
        return promise;

    promise = new BPromise(function (resolve, reject) {

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
            L.debug('Connection made to: '+uri);
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
            L.err('Connection faile to: '+uri);
            reject(err);
            mongoose.connection.removeListener('open', resolveIt);
            process.removeListener('SIGINT', disconnectIt);
        }

    })
    .then(function (connection) {
        return connection;
    })
    .catch(function (err) {
        L.fatal(err.msg+"\n"+err.stack);
        process.exit();
    });

    L.debug('Opening connection to: '+uri);
    mongoose.connect(uri);

    return promise;
};
