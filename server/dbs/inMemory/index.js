"use strict";

const L = require('../../logger')('dbs.memory'),
      BPromise = require('bluebird'),
      uuid = require('uuid'),
      _ = require('lodash'),
      DB = {};

let connection = module.exports = {
    connect : connect,
    disconnect: disconnect,
    add : add,
    get : get,
    update: update,
    clear: clear,
    DB: function () { return DB; }
};

function connect () {
    L.debug('connecting');
    return BPromise.resolve(connection);
}

function disconnect () {
    L.debug('disconnecting');
    return BPromise.resolve(connection);
}

function add () {
    let items = _.toArray(arguments),
        collection = items.shift();

    if (DB[collection] === undefined) {
        DB[collection] = {};
    }

    L.debug("Adding "+items.length+" items to "+collection);
    return new BPromise(function (resolve) {
        items.map(function (item) {
            let id = uuid.v1();
            item.id = id;
            DB[collection][id] = item;
            return item;
        });
        resolve(items.length);
    });
}

/*
 * Find the actual object
 */
function find (collection, selector) {

    L.debug("Looking in "+collection+" for "+JSON.stringify(selector));

    if (DB[collection] === undefined) {
        L.err("Trying to get an item from a non-existent collection: "+collection);
        return BPromise.resolve([]);
    }

    if (selector._id != null) {
        return new BPromise(function (resolve) {
            resolve(
                selectObject(selector, DB[collection][selector._id])
                ? [DB[collection][selector._id]]
                : []
            );
        });
    }

    let matched = [];
    for (let id in DB[collection]) {
        if (selectObject(selector, DB[collection][id])) {
            matched.push(DB[collection][id]);
        }
    }

    return BPromise.resolve(matched);
}

function get (collection, selector) {
    return find(collection, selector)
    .then(function (items) {
        return _.cloneDeep(items);
    });
}

function selectObject (selector, obj) {

    if (!obj) {
        return false;
    }

    for (let key in selector) {
        if (obj[key] !== selector[key]) {
            return false;
        }
    }

    return true;
}

function update (collection, selector, changed) {

    return new BPromise(function (resolve, reject) {

        find(collection, selector)
        .then(function (items) {
            if (items.length === 0) {
                reject(new Error('No items found'));
                return;
            }
            if (items.length > 1) {
                reject(new Error('Multiple items found'));
                return;
            }
            _.extend(items[0], changed);
            resolve(1);
        });
    });
}

function clear () {
    DB = {};
    return BPromise.resolve(connection);
}
