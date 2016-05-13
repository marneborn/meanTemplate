"use strict";

const fs       = require('fs'),
      path     = require('path'),
      bowerDir = findBowerDir(),
      cache    = {
          file: path.resolve(__dirname, './wiredep-cache.json'),
          ageLimit: 24*60*60*1000 // once a day
      };

if (noCache() || tooOld() || bowerTouched()) {
    module.exports = createNew();
}
else {
    module.exports = require(cache.file);
}

function createNew () {
    let wiredep = require('wiredep'),
        wiredepRes = wiredep();
    fs.writeFileSync(cache.file, JSON.stringify(wiredepRes));

    return wiredepRes;
}

function findBowerDir () {
    let bowerrc;
    try {
        bowerrc = require('.bowerrc');
    }
    catch (err) {
        bowerrc = {};
    }
    if (!bowerrc.diretory) {
        bowerrc.directory = "bower_components";
    }
    return path.resolve(bowerrc.directory);
}

function noCache () {
    try {
        cache.stats = fs.statSync(cache.file);
        return false;
    }
    catch (err) {
        return true;
    }
}

function bowerTouched () {
    let bowerStats;
    try {
        bowerStats = fs.statSync(bowerDir);
    }
    catch (err) {
        return false;
    }

    return bowerStats.mtime.getTime() > cache.stats.mtime.getTime();
}

function tooOld () {
    return (new Date()).getTime() - cache.stats.mtime.getTime() > cache.ageLimit;
}
