"use strict";

var env  = (process.env.NODE_ENV || 'production').replace(/(?:^\')|(?:\'$)/g, '');
module.exports = env !== 'production';
