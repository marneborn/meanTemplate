"use strict";

const path = require('path'),
      L = require('../logger')('userComponent'),
      config = require('../config'),
      DB = require('../dbs/mongoose');

module.exports = function setupUser (app) {

    app.use(require('./authenticate'));
    app.use(require('./user.routes.js'));

    return DB.connect(config.dbs.user)
        .then(function () {
            let file = path.resolve(__dirname, './user.model.js');
            L.debug("Adding model: "+file);
            // FIXME - want to pass connection into model...
            require(file);
        });
};
