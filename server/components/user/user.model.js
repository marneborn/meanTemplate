"use strict";

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
	bcrypt   = require('bcrypt'),
    L        = require('../../logger')('user:model'),
    HASH_ROUNDS = 10;

/**
 * A password is only required for local provider.
 * For that case make sure that it's secure enough (length >= 6 for now)
 */
var checkPassword = function (password) {
	return !isLocal(this) || password && password.length >= 6;
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
		match: [/.+\@.+\..+/, 'Invalid email address']
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
                'enum': ['local', 'facebook', 'google', 'linkedin', 'github'],
		        'required': 'Provider name is required'
	        },
            lookup : {
                type: String,
                required: 'Need a way to lookup the user within the provider'
            },
            _id: false,
            details : {}
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
userSchema.methods.authenticate = function (password, callback) {
	bcrypt.compare(password, this.password, callback);
};

userSchema.methods.getProvider = function (providerName, uniqueID) {
    var i;
    for (i=0; i<this.providers.length; i++) {

        if ( this.providers[i].source !== providerName )
            continue;

        if (uniqueID != null && this.providers[i].lookup !== uniqueID)
            continue;

        return this.providers[i];
    }

    return null;
};

userSchema.methods.scrub = function () {
    this.password = undefined;
    this.salt     = undefined;
    return this;
};

userSchema.methods.forClient = function () {

    var copy = _.cloneDeep(this.toObject());
    copy._id = this._id.toString();
    delete copy.created;
    delete copy.touched;
    delete copy.__v;
    for (var i=0; i<copy.providers.length; i++) {
        delete copy.providers[i].details;
        if (copy.providers[i].source !== 'local') {
            delete copy.providers[i].lookup;
        }
    }

    // FIXME - Client probably doesn't need to know about roles...
    delete copy.roles;

    return copy;
};

module.exports = mongoose.model('User', userSchema);
L.debug("Defined User model");
