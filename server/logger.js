"use strict";

var pkg = require('../package');

module.exports = function (name) {
    return {
        debug : require('debug')([pkg.name, name, 'debug'].join(':')),
        log   : require('debug')([pkg.name, name, 'log'].join(':')),
        warn  : require('debug')([pkg.name, name, 'warn'].join(':')),
        err   : require('debug')([pkg.name, name, 'err'].join(':')),
        fatal : require('debug')([pkg.name, name, 'fatal'].join(':'))
    };
};
