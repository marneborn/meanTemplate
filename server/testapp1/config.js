"use strict";

var _ = require('lodash'),

    name         = 'testapp1',
    components   = [
        'user',
        'mngCoverup'
    ],

    L = require('../logger')(name+':config'),

    config = {
        name : name,
        thisDir : 'web/'+name,
        components : components
    };

module.exports = _.extend(
    config,
    require('../subAppUtils/build-definitions')(config)
);

L.debug("---- Configuration ----\n"+JSON.stringify(config, null, 4)+"\n----------------");
