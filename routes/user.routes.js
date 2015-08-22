"use strict";

var express = require('express'),
    user    = require('../server/user'),
    router  = express.Router();

router.route('/user/signup')
.post(user.signup);

router.route('/user/signin')
.post(user.signin);

router.route('/user/signout')
.post(user.signout)
.get(user.signout);

module.exports = router;
