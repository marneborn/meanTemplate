"use strict";

// Generating the build-definitions is slow (in particular wiredep).
// Enable turning it off to make tests faster.
if (process.env.DONT_LOAD_SUBAPPS) {
    module.exports = {
        list : [],
        default: ''
    };
}

else {

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
}
