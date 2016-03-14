"use strict";

var path = require('path'),
    L = require('./logger')('404');

module.exports = function (req, res) {
    L.debug('Unhandled request: '+req.url+' - '+JSON.stringify(req.headers));

    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.resolve('web/404.html'));
    }
    else if (req.accepts('json')) {
        res.json({ error : 'not a valid endpoint: '+req.url });
    }
    else {
        res.end();
    }
};
