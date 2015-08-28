"use strict";

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	bcrypt   = require('bcrypt'),
    L        = require('../server/logger')('user-model'),
    HASH_ROUNDS = 10;

/**
 * A password is only required for local provider.
 * For that case make sure that it's secure enough (length >= 6 for now)
 */
var checkPassword = function (password) {
	return !isLocal(this) || (password && password.length >= 6);
};

/**
 * determine if there is a local provider
 */
function isLocal (doc) {
    for (var i=0; i<doc.providers.length; i++) {
        if (doc.providers[i].source === 'local') {
            return true;
        }
    }
    return false;
}

/**
 * User Schema
 */
var userSchema = new Schema({

	email: {
		type: String,
		trim: true,
		default: '',
        unique: 'That email is already taken',
		required: 'An email is required',
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	displayname: {
		type: String,
        default: "",
		trim: true
	},
    password: {
		type: String,
		default: '',
		validate: [checkPassword, 'Password should be at least 6 characters']
	},
	salt: {
		type: String
	},

    providers: [
        {
            source: {
		        'type': String,
                'enum': ['local', 'facebook', 'google', 'twitter', 'linkedin', 'github'],
		        'required': 'Provider name is required'
	        },
            lookup : {
                type: String,
                required: 'Need a way to lookup the user within the provider'
            },
            _id: false,
            extra : {}
        }
    ],

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
		type: Date
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

// Primary lookup will be by source and lookup, so index that
userSchema.index({ "providers.source": 1, "providers.lookup": 1 }, { unique : true });

/**
 * Encrypt the password on a save, if it's changed.
 */
userSchema.pre('save', function(next) {
    var self = this;

    self.touched = new Date();

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
userSchema.methods.authenticate = function (password, callback) {
	bcrypt.compare(password, this.password, callback);
};

/**
 * find an unused username that is similar to the one given
 */
userSchema.statics.findUniqueUsername = function(username, suffix, callback) {
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

module.exports = mongoose.model('User', userSchema);
