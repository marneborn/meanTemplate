"use strict";

var debug      = require('debug');

/*
 * Show each incoming request on the screen if DEBUG contains first
 */
module.exports = function (app) {

    var first = debug('first'),
        origFormat;

    if (!first.enabled) {
        return;
    }

    origFormat = debug.formatArgs;
	app.use( function (req, res, next) {
		debug.formatArgs = formatArgs;
		first("URL = "+req.method+' '+req.url);
		debug.formatArgs = origFormat;
		next();
	});
};


/*
 * method override for formatting incoming requests.
 */
function formatArgs () {

	var self     = this, /* jshint ignore:line */
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
