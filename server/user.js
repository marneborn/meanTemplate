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

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;

	// Then save the user
	user.save(function(err) {

        var errDets;

		if (err) {
            errDets = parseValidationError(err);
            console.log(""+JSON.stringify(errDets));
            if (errDets) {
                res.status(400).json(errDets);
            }
            else {
			    res.status(400).json({_type: 'UnknownError'});
            }
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
	passport.authenticate('local', function(err, user, info) {
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

/*
 *
 */
function parseValidationError (err) {

    if (!err || err.name !== 'ValidationError')
        return null;

    var fields = Object.keys(err.errors),
        obj = {
            _type : err.name
        },
        i;

    for (i=0; i<fields.length; i++) {
        obj[fields[i]] = err.errors[fields[i]].message;
    }

    return obj;
}
