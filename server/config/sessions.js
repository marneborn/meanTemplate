"use strict";

var _ = require('lodash'),
    path = require('path'),
    db = _.cloneDeep(require('./db')),
    config = {
        db : _.extend(
            db,
            {
	            "type"         : "mongo",
	            "collection"   : "sessions",
	            "stringify"    : false,
	            "autoReconnect": true
            }
        )
    };

_.merge(config, require(path.resolve('secrets.js')).sessions);
module.exports = config;
