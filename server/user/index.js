"use strict";

const L = require('../logger')('user'),
      path = require('path'),
      config = require('../config'),
      DB = require('../dbs/mongoose');

module.exports = function (app) {
    let conn = DB.connect(config.dbs.user);

    conn
        .then(function () {
            var file = path.resolve(__dirname, './user.model.js');
            L.debug("Adding model: "+file);
            // FIXME - want to pass connection into model...
            require(file);
        });

    app.use(require('./authenticate'));
    app.use(require('./user.routes'));

    return conn;
};
