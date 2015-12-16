"use strict";

var pkg  = require('../../package.json'),
    L = require('../logger')('config'),
    name = pkg.name,
    isDev = require('./isDev'),
    config;

module.exports = config = {
    name         : name,
    isPrd        : !isDev,
    isDev        : isDev,
    host         : process.env.HOST || (isDev ? 'local.meantemplate.com' : 'meantemplate.com'),
    port         : process.env.PORT || 8080,
    db           : require('./db'),
    sessions     : require('./sessions'),
    authenticate : require('./authenticate'),
    subApps      : require('./subApps'),
    components   : require('./components'),
    build        : require('./build')
};

config.fullHost = "http://" + config.host + (config.port === 80 ? "" : ":"+config.port);

L.log(
    "^^^^ Configuration ^^^^\n"
        +JSON.stringify(module.exports, null, 4)
        +"\n----------------"
);
