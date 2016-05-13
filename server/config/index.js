"use strict";

const pkg  = require('../../package.json'),
      _ = require('lodash'),
      fs = require('fs'),
      L = require('../logger')('config'),
      name = pkg.name,
      isDev = require('./isDev');

let config = module.exports = {
    name         : name,
    isDev        : isDev,
    host         : require('./host'),
    port         : require('./port'),
    dbs          : require('./dbs'),
    sessions     : require('./sessions'),
    authenticate : require('./authenticate'),
    subApps      : require('./subApps'),
    components   : require('./components'),
    build        : require('./build')
};

// FIXME - protocol should be configurable
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

    let numBUs = 4,
        dir = './logs',
        currentLog = dir+'/currentConfig.log';

    L.log(
        "^^^^ Configuration ^^^^\n"
            +JSON.stringify(module.exports, null, 4)
            +"\n----------------"
    );

    try {
        fs.mkdirSync(dir);
    }
    catch (err) {}

    for (let i=numBUs-1; i>=0; i--) {
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
