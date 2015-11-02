"use strict";

var pkg  = require('../../package.json'),
    _ = require('lodash'),
    L = require('../logger')('config'),
    name = pkg.name,
    env  = process.env.NODE_ENV || 'development',
    config = {
        name         : name,
        host         : process.env.HOST || '127.0.0.1',
        port         : process.env.PORT || 8080,
        db           : require('./db'),
        sessions     : require('./sessions'),
        authenticate : require('./authenticate')
    };

module.exports = config;

// remove leading and trailing quotes
env = env.replace(/(?:^\')|(?:\'$)/g, '');
config.isPrd = env === 'production';
config.isDev = !config.isPrd;

L.debug("^^^^ Configuration ^^^^\n"+JSON.stringify(module.exports, null, 4)+"\n----------------");
