var config = require('./config');

module.exports = function (name) {
	return {
		debug : require('debug')([config.name, name, 'debug'].join(':')),
		log   : require('debug')([config.name, name, 'log'].join(':')),
		err   : require('debug')([config.name, name, 'err'].join(':')),
		fatal : require('debug')([config.name, name, 'fatal'].join(':'))
	};
};
