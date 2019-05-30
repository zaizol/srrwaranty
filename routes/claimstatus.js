var express = require('express');
var passport = require('passport');
var router = express.Router();
var Customer = require('../models/customer');
var Product = require('../models/products');
var Claim = require('../models/claims');
var moment = require('moment');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
    res.render('claimstatus.ejs', { title: 's', user: req.user, momemt: moment });
});




module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}