"use strict";

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
    passport = require('passport'),
    strategies = require('./strategies'),
    mongooseUtils = require('../../mongooseDB/utils'),
    L = require('../../logger')('user');

module.exports = {
    signout : signout,
    signup : signup,
    signin : signin,
    update : update,
    providerLogin : providerLogin,
    removeOAuthProvider : removeOAuthProvider
};

function signout (req, res) {
	req.logout();
    res.status(200).end();
}

function signup (req, res) {
    L.debug("Signing up a new user: "+JSON.stringify(req.body));

    if (!req.body.email) {
        res.status(400).send("Missing Required: email");
        return;
    }

    // First check if this email is already associated with a partner login
    User.findOneAsync({ email: req.body.email })
    .then(function (user) {

        if (!user) {
            user = new User(strategies.local.createNewUser(req.body));
        }

        else {
            var existingProvider = user.getProvider('local');

            if (user.getProvider('local')) {
                res.status(400).send("Existing user");
                return null;
            }

	        user.providers.push(strategies.local.createProvider(req.body));
            user.password = req.body.password;
        }

        return user.save();
    })
    .then(function (user) {

        if (!user) {
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
			res.status(200).json(user);
		});
    })
    .catch(function (err) {
        var errDeets = mongooseUtils.parseError(err);
        res.status(400).json(errDeets);
        return;
	});
}

/**
 * Signin after passport authentication
 */
function signin (req, res, next) {

    passport.authenticate('local', function(err, user, info) {
        if (err || !user) {
            res.status(400).send(info);
        } else {
            // Remove sensitive data before login
            user.scrub();
            L.debug(""+JSON.stringify(user));
            req.login(user, function(err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.status(200).json(user);
                }
            });
        }
    })(req, res, next);
}

/*
 *
 */
function update (req, res) {

    var props = Object.keys(req.body);
    for (var i=0; i<props.length; i++) {
        req.user[props[i]] = req.body[props[i]];
    }

    req.user.save(function (err, user) {

        if (err) {
            res.status(400).json(
                Object.keys(err.errors)
                .map(function (key) {
                    return key + ':' + err.errors[key].message;
                })
            );
        }
        else {
            res.status(200).json(user);
        }
    });
}

/*
 *
 */
function providerLogin (strategy) {
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
}

/**
 * Remove OAuth provider
 * FIXME - need to port over to my way
 */
function removeOAuthProvider (req, res) {
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
}
