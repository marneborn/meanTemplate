"use strict";

const path = require('path'),
      _ = require('lodash'),
      myUtils = require('../utils'),

      Module = require('module'),
      _load = Module._load,
      _findPath = Module._findPath,
      _require = Module.prototype.require,

      exts = Object.keys(Module._extensions);

let mocks = {};
let stats = {};

module.exports = addMock;
module.exports.stop = stopMocking;
module.exports.clearCache = clearCache;
module.exports.monitor = monitorRequires;
module.exports.stopMonitoring = stopMonitoring;

function startMocking () {

    if (Module._load !== _load) {
        return;
    }

    Module._load = function (request, parent) {

        let files = forceFindAll(request, parent);
        for (let i=0; i< files.length; i++) {

            let file = files[i];
            if (mocks[file] !== undefined) {
                return mocks[file];
            }

            for (let j=0; j<exts.length; j++) {
                let file = files[i]+exts[j];
                if (mocks[file] !== undefined) {
                    return mocks[file];
                }
            }

            file = path.join(files[i], 'index.js');
            if (mocks[file] !== undefined) {
                return mocks[file];
            }
        }

        return _load.apply(this, arguments);
    };
}

function stopMocking () {
    mocks = {};
    Module._load = _load;
}

function addMock (request, mockExport) {

    let file = forceFindFirst(request, module.parent);
    if (!path.extname(file)) {
        throw new Error("You must specify the file extension when adding a mock require");
    }

    startMocking();
    mocks[file] = mockExport;
    return mockExport;
}

function clearCache (file) {
    let files = Object.keys(require.cache);
    if (file) {
        if (file !== '__ALL__') {
            files = files
                .filter(function (key) {
                    return file == null || file === key;
                });
        }
    }
    else {
        files = files
            .filter(function(key) {
                return !key.match(/[\/\\]node_modules[\/\\]/)
                    && !key.match(/Gruntfile.js/)
                    && !key.match(/[\/\\]grunt[\/\\]/);
            });
    }

    files
        .forEach(function(key) {
            delete require.cache[key];
        });
}

function findPathFirst (request, paths) {
    let dir;
    for (let i=0; i<paths.length; i++) {
        if (myUtils.dirExists(paths[i])) {
            dir = paths[i];
            break;
        }
    }
    if (!dir) {
        dir = paths[0];
    }
    return path.resolve(dir, request);
}

function findPathAll (request, paths) {
    return paths.map(function (dir) {
        return path.resolve(dir, request);
    });
}

function forceFindFirst (request, parent) {

    try {
        let file = Module._resolveFilename(request, parent);
        return file;
    }
    catch (err) {}

    Module._findPath = findPathFirst;
    let file = Module._resolveFilename(request, parent);
    Module._findPath = _findPath;
    return file;
}

function forceFindAll (request, parent) {
    Module._findPath = findPathAll;
    let files = Module._resolveFilename(request, parent);
    Module._findPath = _findPath;
    return _.isArray(files) ? files : [files];
}

function monitorRequires () {

    stats = {};
    Module.prototype.require = function (request) {
        let name, ret;

        try {
            name = Module._resolveFilename(request, this);
        }
        catch (err) {
            name = request;
        }

        if (!stats[name]) {
            stats[name] = {
                calls: 0,
                time: 0,
                max: 0
            };
        }
        stats[name].calls++;

        let t = -(new Date()).getTime();
        ret = _require.apply(this, arguments);
        t += (new Date()).getTime();
        stats[name].time += t;

        if (t > stats[name].max) {
            stats[name].max = t;
        }

        return ret;
    };

}

function stopMonitoring () {
    Module.prototype.require = _require;
    return Object.keys(stats)
        .map(function (key) {
            return { file: key, calls: stats[key].calls, time: stats[key].time, max: stats[key].max };
        })
        .sort(function (a, b) { return b.time - a.time; })
        .map(function (stat) {
            stat.file = stat.file.replace(process.cwd()+'\\', '');
            return stat;
        });
}
