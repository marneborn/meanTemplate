"use strict";

var pkg  = require('../../package.json'),
    name = pkg.name;

module.exports = {
    user : {
        host     : process.env.MONGOHOST || '127.0.0.1',
        port     : process.env.MONGOPORT || 27017,
        db       : process.env.MONGONAME || name
    }
};
