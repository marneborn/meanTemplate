"use strict";

const isDev = require('./isDev');

module.exports = {
    // min = minified
    // ann = ngAnnotated but not minified
    // anything else uses the src code
    type : isDev ? '' : 'min',
    vendorMin : true
};
