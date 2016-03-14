"use strict";

const path = require('path'),
      _ = require('lodash'),
      subApps = require('./subApps'),
      components = [];

// Create a list of used components.
for (let i=0; i<subApps.list.length; i++) {
    let subApp = subApps.list[i];
    components.push(
        require(path.resolve('./server/'+subApp+'/config')).components || []
    );
}

module.exports = _.uniq(_.flattenDeep(components));
