"use strict";

let config = module.exports = {
    list : [
        'testapp1',
        'testapp2'
    ],
    default : 'testapp1'
};

for (let i=0; i<config.list.length; i++) {
    let subAppName = config.list[i];
    config[subAppName] = require('../'+subAppName+'/config');
}
