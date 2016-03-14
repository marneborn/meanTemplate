"use strict";

const debug = require('debug'),
      pkg = require('../package');

/*
 * Show each incoming request on the screen if DEBUG contains first
 */
module.exports = function (app) {

    let first = debug([pkg.name, 'first'].join(':')),
        origFormat;

    if (!first.enabled) {
        return;
    }

    if (debug.useColors()) {
       origFormat = debug.formatArgs;
       app.use( function (req, res, next) {
            debug.formatArgs = formatArgs;
                  first("URL = "+req.method+' '+req.url);
            debug.formatArgs = origFormat;
            next();
       });
    }
    else {
        app.use( function (req, res, next) {
                  first("URL = "+req.method+' '+req.url);
            next();
        });
    }
};


/*
 * method override for formatting incoming requests.
 */
function formatArgs () {

    let self     = this, /* jshint ignore:line */
        args     = arguments,
        name     = self.namespace,
        bgOpen   = '\u001b[41m', // red background
        bgClose  = '\u001b[49m',
        fg1Open  = '\u001b[30m', // black foreground
        fg1Close = '\u001b[39m',
        fg2Open  = '\u001b[31m', // red foreground
        fg2Close = '\u001b[39m';

    args[0] = '  '
        + bgOpen
        + fg1Open
        + name
        + fg1Close
        + bgClose
        + ' '
        + args[0]
        + fg2Open
        + ' +'
        + debug.humanize(self.diff)
        + fg2Close;

    return args;
}
