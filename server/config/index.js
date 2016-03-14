"use strict";

var pkg  = require('../../package.json'),
    _ = require('lodash'),
    fs = require('fs'),
    L = require('../logger')('config'),
    name = pkg.name,
    isDev = require('./isDev'),
    config;

module.exports = config = {
    name         : name,
    isPrd        : !isDev,
    isDev        : isDev,
    host         : process.env.HOST || (isDev ? 'local.meantemplate.com' : 'meantemplate.com'),
    port         : process.env.PORT || (isDev ? 8080 : 80),
    dbs          : require('./dbs'),
    sessions     : require('./sessions'),
    authenticate : require('./authenticate'),
    subApps      : require('./subApps'),
    components   : require('./components'),
    build        : require('./build')
};

config.fullHost = "http://" + config.host + (config.port === 80 ? "" : ":"+config.port);

try {
    _.merge(config, require('./secrets'));
}
catch (err) {
    if (!err.message.match(/Cannot find module/)) {
        throw err;
    }
}

dumpConfig();

function dumpConfig () {

    var numBUs = 4,
        dir = './logs',
        currentLog = dir+'/currentConfig.log',
        i;

    L.log(
        "^^^^ Configuration ^^^^\n"
            +JSON.stringify(module.exports, null, 4)
            +"\n----------------"
    );

    try {
        fs.mkdirSync(dir);
    }
    catch (err) {}

    for (i=numBUs-1; i>=0; i--) {
        try {
            fs.renameSync(
                i === 0 ? currentLog : currentLog+"."+i,
                currentLog+"."+(i+1)
            );
        }
        catch (err) {}
    }

    try {
        fs.writeFileSync(
            currentLog,
            "Server started on: "+new Date()+"\n"
                +JSON.stringify(module.exports, null, 4)
        );
    }
    catch (err) {
        L.err("Couldn't dump config to currentConfig.log\n"+err.stack);
    }
}
