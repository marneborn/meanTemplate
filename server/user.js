"use strict";

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
    passport = require('passport');

exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

exports.signup = function (req, res) {

	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;

	// Then save the user
	user.save(function(err) {
		if (err) {
			res.status(400).send(err);
            return;
		}

		// Remove sensitive data before login
		user.password = undefined;
		user.salt = undefined;

        console.log(""+req.login);
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
    console.log("0> "+JSON.stringify(req.body));
	passport.authenticate('local', function(err, user, info) {
        console.log("1> "+err+','+JSON.stringify(user));
		if (err || !user) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

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
