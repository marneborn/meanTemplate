"use strict";

const argv = require('./argv'),
      isDev = require('./isDev'),
      local = 'local.meantemplate.com',
      real  = 'meantemplate.com';

if (argv.host != null) {
    module.exports = argv.host === 'local' ? local : real;
}
else if (process.env.host != null) {
    module.exports = process.env.host;
}
else if (isDev) {
    module.exports = local;
}
else {
    module.exports = real;
}
