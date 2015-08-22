'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	bcrypt   = require('bcrypt'),
    HASH_ROUNDS = 10;

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
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
		trim: true
	},
	username: {
		type: String,
		trim: true
	},

    password: {
		type: String,
		default: '',
        required: 'You need a password',
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

module.exports = mongoose.model('User', UserSchema);
