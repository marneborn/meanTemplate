"use strict";

var pkg  = require('../package.json'),
    _ = require('lodash'),
    L = require('./logger')('config'),
    name = pkg.name,
    env  = process.env.NODE_ENV || 'development',
    config = {};

module.exports = config;

// remove leading and trailing quotes
env = env.replace(/(?:^\')|(?:\'$)/g, '');

var db = {
    host     : process.env.MONGOHOST || '127.0.0.1',
	port     : process.env.MONGOPORT || 27017,
	db       : name
};

config.name  = name;
config.host  = process.env.HOST || '127.0.0.1';
config.port  = process.env.PORT || 8080;

config.db = _.clone(db);
config.sessions = {
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

config.authenticate = {};
_.extend(config.authenticate, require('./config/authentication'));
_.merge(config, require('./config/secrets'));

config.isPrd = env === 'production';
config.isDev = !config.isPrd;

L.debug("^^^^ Configuration ^^^^\n"+JSON.stringify(module.exports, null, 4)+"\n----------------");
