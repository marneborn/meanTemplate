"use strict";

var BPromise = require('bluebird'),
    _ = require('lodash'),
    mongodb = BPromise.promisifyAll(require('mongodb'), { suffix: 'Promise' }),
    ObjectID = require('mongodb').ObjectID,
    L = require('../../logger')('dbs:mongo'),
    mongoUtils = require('./utils'),

    DB = module.exports = {
        connect : connect,
        disconnect : disconnect,
        connection : BPromise.reject(new Error("Connection hasn't been started")),
        add : add,
        get : get,
        update : update
    };

// Need to "handle" the default rejection;
DB.connection.catch(function () {});

function connect (config) {

    if (!DB.connection.isRejected()) {
        return DB.connection;
    }

    // FIXME - should probably check the rejection reason and start or not based on that...
    // FIXME - Need to detect disconnections and change the connection promise to pending.

    var uri  = mongoUtils.makeMongoURI (config);
    DB.connection = mongodb.connectPromise(uri);

    DB.connection
    .then(function(db) {
        return db;
    })
    .catch(function (err) {
	    L.err(""+err+(err.stack ? "\n"+err.stack : ""));
    });

    return DB.connection;
}

function disconnect () {
    return DB.connection.call('close');
}

function add () {
    var items = _.toArray(arguments),
        collName = items.shift();

    return DB.connection
    .call('collectionPromise', collName)
    .call('insert', items.map(function (sel) {
        mungeSelector(sel);
        return sel;
    }))
    .then(function (res) {
        return res.result.n;
    });
}

function get (collName, selector, opts) {

    if (!opts) {
        opts = {};
    }

    mungeSelector(selector);
    var cursor = DB.connection
    .call('collectionPromise', collName)
    .call('findPromise', selector, opts.projection);

    if (opts.limit != null) {
        cursor
        .then(function (cur) {
            cur
            .sort({_id:-1})
            .limit(opts.limit);
        });
    }

    return cursor.call('toArrayPromise');
}

function update (collName, selector, changed) {
    mungeSelector(selector);
    return DB.connection
    .call('collectionPromise', collName)
    .call('updatePromise', selector, { $set : changed })
    .then(function (obj) {
        return obj.nModified;
    });
}

function mungeSelector (selector) {
    if (selector._id != null) {
        selector._id = new ObjectID(selector._id);
    }
}
