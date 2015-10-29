"use strict";

var globule = require('globule'),
    path = require('path');

module.exports.loaded = false;
module.exports.strategies = {};
module.exports.load = function (passport, User) {
    globule.find(__dirname+"/*.js").forEach(function(file) {
        var provider = path.basename(file, '.js');
        if (provider === 'all' || provider.indexOf('_') === 0)
            return;
		module.exports.strategies[provider] = require(path.resolve(file)).load(passport, User);
	});
    module.exports.loaded = true;
};
