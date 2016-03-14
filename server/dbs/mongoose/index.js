"use strict";

/**
 * Module dependencies.
 * FIXME - Should probably be a constructor to allow multiple mongooseDBs in the same app.
 */
const BPromise = require('bluebird'),
      mongoose = require('mongoose'),
      mongoUtils = require('../mongo/utils'),
      L = require('../../logger')('dbs:mongoose');

let connection = BPromise.reject(new Error("Connection hasn't been started"));

// Need to "handle" the default rejection;
connection.catch(function () {});

module.exports = {
    connect: connect
};

function connect (config) {

    if (!connection.isRejected()) {
        return connection;
    }

    // FIXME - should probably check the rejection reason and start or not based on that...
    // FIXME - Need to detect disconnections and change the connection promise to pending.

    let uri = mongoUtils.makeMongoURI(config);

    connection = new BPromise(function (resolve, reject) {

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
        .catch(function (err) {
            L.fatal(err.msg+"\n"+err.stack);
            process.exit();
        });

    mongoose.connect(uri);

    connection.then(function () {
        console.log("Connected");
    });
    return connection;
}
