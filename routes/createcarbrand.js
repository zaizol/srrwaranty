var express = require('express');
var passport = require('passport');
var router = express.Router();
var Carbrand = require('../models/carbrand');
var moment = require('moment');

router.get('/', isLoggedIn, function(req, res, next) {
    Carbrand.find().lean().distinct('brand').exec((err, brands) => {
        res.render('createcarbrand.ejs', { user: req.user, CarData: null, brand: brands });
    });
});

router.get('/:id', isLoggedIn, function(req, res, next) {
    Carbrand.findById(req.params.id).exec((err, CarData) => {
        Carbrand.find().lean().distinct('brand').exec((err, brands) => {
            res.render('createcarbrand.ejs', { user: req.user, CarData: CarData, brand: brands });
        });
    });
});

router.post('/searchbrand', isLoggedIn, function(req, res, next) {
    (req.body.ddl_brand != '') ?
    Carbrand.find({ 'brand': req.body.ddl_brand }).exec((err, brands) => {
            res.end(JSON.stringify(brands));
        }):
        Carbrand.find().exec((err, brands) => {
            res.end(JSON.stringify(brands));
        });
});

router.post('/:id', isLoggedIn, function(req, res, next) {
    Carbrand.findOneAndUpdate({ _id: req.params.id }, { $set: { brand: req.body.txt_brand } }, { new: true }, function(err, doc) {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        res.redirect('/carbrand');
    });
});
router.post('/', isLoggedIn, function(req, res, next) {
    //insert
    var newcarbrand = Carbrand();
    newcarbrand.brand = req.body.txt_brand;
    newcarbrand.save(function(err) {
        if (err)
            throw err;
        res.redirect('/carbrand');
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}