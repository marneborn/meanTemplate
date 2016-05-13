"use strict";

const argv = require('./argv'),
      isDev = require('./isDev');

if (argv.port != null) {
    module.exports = argv.port;
}
else if (process.env.port != null) {
    module.exports = process.env.port;
}
else if (isDev) {
    module.exports = 8080;
}
else {
    module.exports = 80;
}
