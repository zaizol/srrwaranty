var express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var router = express.Router();
var User = require('../models/user');
var moment = require('moment');


router.get('/', isLoggedIn, function(req, res) {
    res.render('setup.ejs', { user: req.user, msgpwd: req.flash('ResetPassword') });
});

router.post('/setnewpassword', isLoggedIn, function(req, res) {
    User.findById(req.user.id, function(err, user) {
        user.local.password = bcrypt.hashSync(req.body.newpassword, bcrypt.genSaltSync(8), null);
        user.save(function(err) {
            if (err)
                throw err;
            req.flash('ResetPassword', 'รหัสผ่านของท่านได้ถูกแก้ไขแล้ว');
            res.redirect('/setup');
        });
    });
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}