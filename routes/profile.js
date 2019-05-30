var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user');
var moment = require('moment');


router.get('/', isLoggedIn, function(req, res) {
    res.render('profile.ejs', { user: req.user });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}