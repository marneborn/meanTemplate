"use strict";

const env  = (process.env.NODE_ENV || 'production').replace(/(?:^\')|(?:\'$)/g, '');
module.exports = env !== 'production';
