"use strict";

var path = require('path'),
    _ = require('lodash'),
    subApps = require('./subApps'),
    i, subApp, components = [];

// Create a list of used components.
for (i=0; i<subApps.list.length; i++) {
    subApp = subApps.list[i];
    components = _.uniq(_.flattenDeep([
        components,
        require(path.resolve('./server/'+subApp+'/config')).components || []
    ]));
}

module.exports = components;