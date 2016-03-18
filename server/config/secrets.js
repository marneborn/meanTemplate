// Wrapper for secrets handling.
"use strict";
const fs = require('fs'),
      path = require('path'),
      utils = require('../utils'),
      argv = require('./argv');

let secretsFile;
if (argv.secrets) {
    secretsFile = path.resolve(argv.secrets);
    if (!utils.fileExists(secretsFile)) {
        throw new Error("Can't find the secrets file you told me to use: "+argv.secrets);
    }
}

if (!secretsFile) {
    secretsFile = path.resolve('secrets.js');
}

module.exports = require(secretsFile);
