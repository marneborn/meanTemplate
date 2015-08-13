"use strict";

var pkg = require('../package.json'),
    env = process.env.NODE_ENV || 'development';

// remove leading and trailing quotes
env = env.replace(/(?:^\')|(?:\'$)/g, '');

module.exports = {
	name  : pkg.name,
	host  : process.env.HOST || '127.0.0.1',
	port  : process.env.PORT || 8080,
    isPrd : env === 'production'
};

module.exports.isDev = !module.exports.isPrd;
