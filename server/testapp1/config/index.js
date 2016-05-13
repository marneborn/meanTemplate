"use strict";

const _ = require('lodash'),
      name = 'testapp1',
      config = {
          name : name,
          title: 'Test App1',
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
