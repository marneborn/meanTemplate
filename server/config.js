"use strict";

var pkg  = require('../package.json'),
    _ = require('lodash'),
    L = require('./logger')('config'),
    name = pkg.name,
    env  = process.env.NODE_ENV || 'development';

// remove leading and trailing quotes
env = env.replace(/(?:^\')|(?:\'$)/g, '');

var db = {
    host     : process.env.MONGOHOST || '127.0.0.1',
	port     : process.env.MONGOPORT || 27017,
	db       : name
};

module.exports = {
	name  : name,
	host  : process.env.HOST || '127.0.0.1',
	port  : process.env.PORT || 8080,
    isPrd : env === 'production',
    db : _.clone(db),
    sessions : {
        secret : 'be very very quiet',
        db : _.extend(
            db,
            {
	            "type"         : "mongo",
	            "collection"   : "sessions",
	            "stringify"    : false,
	            "autoReconnect": true
            }
        )
    }
};

// console.log(JSON.stringify(module.exports, null, 4));
module.exports.isDev = !module.exports.isPrd;
