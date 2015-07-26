"use strict";

var pkg = require('../package.json');

module.exports = {
	name : pkg.name,
	host : process.env.HOST || '127.0.0.1',
	port : process.env.PORT || 8080
};
