"use strict";

const fs = require('fs');

module.exports = {
    fileExists : fileExists,
    dirExists : dirExists
};

function fileExists (file) {
    try {
        if (fs.statSync(file).isFile()) {
            return true;
        }
    }
    catch (err) {}
    return false;
}

function dirExists (file) {
    try {
        if (fs.statSync(file).isDirectory()) {
            return true;
        }
    }
    catch (err) {}
    return false;
}
