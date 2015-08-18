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
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	firstName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your first name']
	},
	lastName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your last name']
	},
	displayName: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	username: {
		type: String,
		unique: 'testing error message',
		required: 'Please fill in a username',
		trim: true
	},
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
        enum: ['local', 'facebook', 'google', 'twitter', 'linkedin', 'github'],
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
});

/**
 * Encrypt the password on a save, if it's changed.
 */
UserSchema.pre('save', function(next) {
    var self = this;

	if (!self.isModified('password'))
		return next();

	bcrypt.genSalt(HASH_ROUNDS, function (err, salt) {

        if (err)
            next(err);

		bcrypt.hash(self.password, salt, function (err, hash) {

			if (err)
                next(err);

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

mongoose.model('User', UserSchema);
