"use strict";

const _ = require('lodash'),
      userDB = _.cloneDeep(require('./dbs')).user;

module.exports = {
        db : _.merge(
        {},
        userDB,
            {
                "type"         : "mongo",
                "collection"   : "sessions",
                "stringify"    : false,
                "autoReconnect": true
            }
        )
    };
