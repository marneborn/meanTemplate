"use strict";

const path = require('path'),
      Module = require('module'),
      _load = Module._load,
      _resolve = Module._resolveFilename,
      exts = Object.keys(Module._extensions),
      cwd = process.cwd();

let mocks = {};

module.exports = addMock;
module.exports.stop = stopMocking;
module.exports.clearCache = clearCache;

Module._resolveFilename = function(request, parent) {
    let fullPath = path.resolve(path.dirname(parent.filename), request),
        relPath = path.relative(cwd, fullPath).replace(/\\/g, '/');
    for (let i = 0, EL = exts.length; i < EL; i++) {
        let relFile = relPath + exts[i];
        if (mocks[relFile] !== undefined) {
            return fullPath+exts[i];
        }
    }
    return _resolve.apply(this, arguments);
};

function startMocking () {

    if (Module._load !== _load) {
        return;
    }

    Module._load = function (request, parent) {
        let relPath = path.relative(cwd, Module._resolveFilename(request, parent))
                .replace(/\\/g, '/');
        if (mocks[relPath] !== undefined) {
            return mocks[relPath];
        }
        return _load.apply(this, arguments);
    };
}

function stopMocking () {
    mocks = {};
    Module._load = _load;
}

function addMock (path, exports) {
    startMocking();
    mocks[path] = exports;
}

function clearCache () {
    Object.keys(require.cache)
        .filter(function(key) {
            return !key.match(/[\/\\]node_modules[\/\\]/)
                || key.match(/Gruntfile.js/)
                || key.match(/[\/\\]grunt[\/\\]/);
        })
        .forEach(function(key) {
            delete require.cache[key];
        });
}
