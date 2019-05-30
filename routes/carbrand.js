var express = require('express');
var passport = require('passport');
var router = express.Router();
var Carbrand = require('../models/carbrand');
var moment = require('moment');

router.get('/', isLoggedIn, function(req, res, next) {
    Carbrand.find().sort({ 'brand': 1 }).exec((err, CarData) => {
        Carbrand.find().lean().distinct('brand').exec((err, brands) => {
            //var s = brands.sort({ 'brand': 1 });
            res.render('carbrand.ejs', { user: req.user, CarData: CarData, brand: brands });
        });
    });
});

router.get('/delete/:id', isLoggedIn, function(req, res, next) {
    Carbrand.findByIdAndRemove(req.params.id, function(err, offer) {
        if (err) { throw err; }
        // ...
        return res.redirect('/carbrand');
    });
});

router.post('/searchbrand', isLoggedIn, function(req, res, next) {
    (req.body.ddl_brand != '') ?
    Carbrand.find({ 'brand': req.body.ddl_brand }).exec((err, brands) => {
            res.end(JSON.stringify(brands));
        }):
        Carbrand.find().exec((err, seriess) => {
            res.end(JSON.stringify(seriess));
        });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}