var express = require('express');
var passport = require('passport');
var router = express.Router();
var moment = require('moment');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
    res.render('maps', { title: 'สรุปทั่วไป', request: null });
});

router.get('/:id', isLoggedIn, function(req, res, next) {
    /*Request.findById(req.params.id).exec(function(err, request) {
        console.log(request);
        if (err)
            throw err
        res.render('maps', { title: 'สรุปทั่วไป', request: request });
    });*/
});
module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}