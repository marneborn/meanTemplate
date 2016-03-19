"use strict";

const fs = require('fs');

module.exports = {
    fileExists : fileExists
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
