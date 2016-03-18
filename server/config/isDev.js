"use strict";

const argv = require('./argv');

if (argv.development || argv.dev) {
    module.exports = true;
}
else if (argv.production || argv.prd) {
    module.exports = false;
}
else {
    let  env = (process.env.NODE_ENV || 'production').replace(/(?:^\')|(?:\'$)/g, '');
    module.exports = env !== 'production';
}
