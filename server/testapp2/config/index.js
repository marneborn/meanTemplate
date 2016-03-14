"use strict";

const _ = require('lodash'),
      name = 'testapp2',
      config = {
          name : name,
          thisDir : 'web/'+name,
          components : [
              'user',
              'makeStyleSheet',
              'mngCoverup'
          ]
      };

module.exports = _.merge(
    config,
    require('../../subAppUtils/build-definitions')(config)
);