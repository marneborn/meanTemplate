"use strict";

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
    passport = require('passport'),
    L = require('./logger')('user');

exports.signout = function(req, res) {
	req.logout();
    res.status(200).end();
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
function parseValidationError (err) {

    if (!err)
        return null;

    var fields, obj = null, i;

    if (err.name === 'ValidationError') {

        fields = Object.keys(err.errors);
        obj = {
            _type : err.name
        };

        for (i=0; i<fields.length; i++) {
            obj[fields[i]] = err.errors[fields[i]].message;
        }
    }

    else if (err.name === 'MongoError' && err.errmsg.indexOf("E11000 duplicate key error index: mean-template.users.$username") === 0) {
        obj = {
            _type: 'duplicate',
            field: 'username'
        };
    }

    return obj;
}
