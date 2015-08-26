'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	bcrypt   = require('bcrypt'),
    L        = require('../server/logger')('user-model'),
    HASH_ROUNDS = 10;

/**
 * Check that the field has a value, but only with the local provider
 */
var validateLocalStrategyProperty = function (property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * Check that password is "secure enough", but only with the local provider
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function (password) {
	return (this.provider !== 'local' || (password && password.length >= 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	email: {
		type: String,
		trim: true,
		default: '',
        unique: 'That email is already taken',
		required: 'An email is required',
		validate: [validateLocalStrategyProperty, 'Please supply your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	realname: {
		type: String,
        default: "",
        index: false,
		trim: true
	},
	username: {
		type: String,
        index: true,
		trim: true
	},

    password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be at least 6 characters']
	},
	salt: {
		type: String
	},

    provider: {
		type: String,
        'enum': ['local', 'facebook', 'google', 'twitter', 'linkedin', 'github'],
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},

    roles: {
		type: [{
			type: String,
			'enum': ['user', 'admin']
		}],
		default: ['user']
	},

	created: {
		type: Date,
		default: Date.now
	},

	touched: {
		type: Date,
		default: Date.now
	},

	resetPassword: {
        token: {
		    type: String
	    },
        expires: {
		    type: Date
	    }
    }
});

/**
 * Encrypt the password on a save, if it's changed.
 */
UserSchema.pre('save', function(next) {
    var self = this;

	if (!self.isModified('password')) {
		next();
        return;
    }

	bcrypt.genSalt(HASH_ROUNDS, function (err, salt) {

        if (err) {
            next(err);
            return;
        }

		bcrypt.hash(self.password, salt, function (err, hash) {

			if (err) {
                next(err);
                return;
            }

		self.password = hash;
			next();
		});
	});
});

/**
 * Create instance method for authenticating user
 */
// Password verification
UserSchema.methods.authenticate = function (password, callback) {
	bcrypt.compare(password, this.password, callback);
};

/**
 * find an unused username that is similar to the one given
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				_this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
            L.err(""+err);
			callback(null);
		}
	});
};

module.exports = mongoose.model('User', UserSchema);
