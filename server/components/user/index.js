"use strict";

var BPromise = require('bluebird'),
    path = require('path'),
    L = require('../../logger')('userComponent');

module.exports = {
    init : init,
    authenticate: require('./authenticate')
};

function init (opts) {

    if (!opts.mongooseDB) {
        return BPromise.reject(new Error("The user component needs a mongooseDB"));
    }

    return opts.mongooseDB
    .then(function () {

        var file = path.resolve(__dirname, './user.model.js');
        L.debug("Adding model: "+file);
        // FIXME - want to pass connection into model...
        require(file);
    });
}
