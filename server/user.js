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
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
	if (!req.user) {
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerUserProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define a search query to find existing user with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};
		User.findOne(searchQuery, function(err, user) {

			if (err) {
				done(err);
                return;
            }

			if (!user) {
				var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');
 				User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
     				user = new User({
						firstName: providerUserProfile.firstName,
						lastName: providerUserProfile.lastName,
						username: availableUsername,
						displayName: providerUserProfile.displayName,
						email: providerUserProfile.email,
						provider: providerUserProfile.provider,
						providerData: providerUserProfile.providerData
					});
     				// And save the user
					user.save(function(err) {
     					return done(err, user);
					});
				});
			} else {
				return done(err, user);
			}
		});
    } else {
		// User is already logged in, join the provider data to the existing user
	    var user = req.user;

		// Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!user.additionalProvidersData) user.additionalProvidersData = {};
			user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');

			// And save the user
			user.save(function(err) {
				return done(err, user, '/#!/settings/accounts');
			});
		} else {
			return done(new Error('User is already connected using this provider'), user);
		}
	}
};

/**
 * Remove OAuth provider
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
				return res.status(400).send({
					message: err.message
				});
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

