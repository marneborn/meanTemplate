"use strict";

var globule = require('globule'),
    path = require('path');

module.exports = {};

module.exports.load = function (passport, User) {
    globule.find(__dirname+"/*.js").forEach(function(file) {
        var provider = path.basename(file, '.js');
        if (provider === 'index' || provider.indexOf('common') === 0)
            return;
		module.exports[provider] = require(path.resolve(file)).load(passport, User);
	});
};
