"use strict";

const _ = require('lodash'),
      name = 'testapp2',
      config = {
          name : name,
          title: 'Test App2',
          thisDir : 'web/'+name,
          components : [
              'header',
              'user',
              'makeStyleSheet',
              'mngCoverup'
          ]
      };

module.exports = _.merge(
    config,
    require('../../subAppUtils/build-definitions')(config)
);
