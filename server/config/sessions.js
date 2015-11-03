"use strict";

var _ = require('lodash'),
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

_.extend(config, require('./secrets').sessions);
module.exports = config;
