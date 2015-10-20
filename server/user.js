"use strict";

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
    passport = require('passport'),
    strategies = require('./authentication/strategies/all').strategies,
    mongoUtils = require('./mongoUtils'),
    L = require('./logger')('user');

exports.signout = function(req, res) {
	req.logout();
    res.status(200).end();
};

exports.signup = function (req, res) {

	var user = new User(strategies.local.makeUser(req.body));

	user.save(function(err) {

		if (err) {
            var errDeets = mongoUtils.parseError(err);
            res.status(400).json(errDeets);
            return;
		}

		// Remove sensitive data before login
		user.password = undefined;
		user.salt = undefined;

		req.login(user, function(err) {
			if (err) {
				res.status(400).send(err);
                return;
			}
			res.json(user);
		});
	});
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err || !user) {
            res.status(400).send(info);
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;
            L.debug(""+JSON.stringify(user));
            req.login(user, function(err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(user);
                }
            });
        }
    })(req, res, next);
};

/*
 *
 */
exports.providerLogin = function (strategy) {
    return function (req, res, next) {
		passport.authenticate(strategy, function(err, user, redirectURL) {
            if (err) {
                L.err(""+err);
            }
			if (err || !user) {
                res.redirect('/#/user/signin');
                return;
			}
			req.login(user, function(err) {
				if (err) {
                    L.err(""+err);
                    res.redirect('/#/user/signin');
                    return;
				}
                res.redirect(redirectURL || '/');
				return;
			});
		})(req, res, next);
    };
};

/**
 * Remove OAuth provider
 * FIXME - need to port over to my way
 */
exports.removeOAuthProvider = function(req, res) {
	var user = req.user;
	var provider = req.param('provider');

	if (user && provider) {
		// Delete the additional provider
		if (user.additionalProvidersData[provider]) {
			delete user.additionalProvidersData[provider];

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');
		}

		user.save(function(err) {
			if (err) {
				res.status(400).send({
					message: err.message
				});
                return;
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	}
};
