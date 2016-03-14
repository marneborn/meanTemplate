// Wrapper for secrets handling.
"use strict";
const fs = require('fs'),
      path = require('path'),
      argv = require('yargs').argv;

let secretsFile;
if (argv.secrets) {
    secretsFile = path.resolve(argv.secrets);
    try {
        fs.statSync(secretsFile).isFile();
    }
    catch (err) {
        console.error(""+err);
        throw new Error("Can't find the secrets file you told me to use: "+argv.secrets);
    }
}

if (!secretsFile) {
    secretsFile = path.resolve('secrets.js');
}

module.exports = require(secretsFile);
