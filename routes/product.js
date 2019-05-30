var express = require('express');
var passport = require('passport');
var router = express.Router();
var moment = require('moment');
var product = require('../models/products');
var Master = require('../models/masters');

router.get('/', isLoggedIn, function(req, res, next) {
    res.render('product.ejs', { user: req.user, moment: moment, hd_type: null });
});

router.get('/gettype', isLoggedIn, function(req, res, next) {
    Master.find({ "type": "producttype" }).lean().distinct('name').exec((err, products) => {
        res.end(JSON.stringify(products));
    });
});
router.post('/getproduct', isLoggedIn, function(req, res, next) {
    if (req.body.ddl_type) {
        if (req.body.txt_name != "") {
            product.find({ "type": req.body.ddl_type, $or:[{ name: { '$regex': req.body.txt_name }}, {productcode: { '$regex': req.body.txt_name }}] }).limit(100).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
                res.end(JSON.stringify(products));
            })
        } else {
            product.find({ "type": req.body.ddl_type }).limit(100).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
                res.end(JSON.stringify(products));
            })
        }

    } else {
        if (req.body.txt_name != "") {
            product.find({ $or:[{ name: { '$regex': req.body.txt_name }}, {productcode: { '$regex': req.body.txt_name }}] }).limit(100).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
                res.end(JSON.stringify(products));
            })
        } else {
            product.find().limit(100).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
                res.end(JSON.stringify(products));
            })
        }
    }
});

router.get('/delete/:id', isLoggedIn, function(req, res, next) {
    product.findByIdAndRemove(req.params.id, function(err, offer) {
        if (err) { throw err; }
        // ...
        return res.redirect('/product');
    });
});

router.post('/addproduct', isLoggedIn, function(req, res, next) {
    var sorts = 1;
    product.find({ "type": req.body.type }).sort({ sort: -1 }).limit(1).exec(function(err, item) {
        var product = new product();
        product.type = req.body.type;
        product.name = req.body.name;
        product.remark = req.body.remark;
        product.online = 1;
        product.save(function(err) {
            if (err)
                throw err;
            res.end();
        });
    });
});


router.post('/', isLoggedIn, function(req, res, next) {
    var sorts = 1;
    product.find({ "type": req.body.txt_type }).sort({ sort: -1 }).limit(1).exec(function(err, item) {
        var product = new product();
        product.type = req.body.txt_type;
        product.name = req.body.txt_name;
        product.remark = req.body.txt_remark;
        product.online = 1;
        product.save(function(err) {
            if (err)
                throw err;
            res.redirect('/product');
        });
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}