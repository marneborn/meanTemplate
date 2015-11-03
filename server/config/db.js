"use strict";

var pkg  = require('../../package.json'),
    name = pkg.name;

module.exports = {
    host     : process.env.MONGOHOST || '127.0.0.1',
    port     : process.env.MONGOPORT || 27017,
    db       : name
};
