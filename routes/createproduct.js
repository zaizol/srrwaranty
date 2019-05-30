var express = require('express');
var passport = require('passport');
var router = express.Router();
var moment = require('moment');
var product = require('../models/products');
var Master = require('../models/masters');

router.get('/', isLoggedIn, function(req, res, next) {
    Master.find().sort({ 'type': 1, 'orders': 1 }).exec(function(err, masters) {
        var products = [];
        for (var i in masters) {
            masteri = masters[i];
            if (masteri.type == "producttype") {
                products.push({ value: masteri.name });
            }
        }
        res.render('createproduct.ejs', { user: req.user, moment: moment, hd_type: null, product: null, producttype: products });
    });

});
router.get('/:id', isLoggedIn, function(req, res, next) {
    Master.find().sort({ 'type': 1, 'orders': 1 }).exec(function(err, masters) {
        var products = [];
       
        for (var i in masters) {
            masteri = masters[i];
            if (masteri.type == "producttype") {
                products.push({ value: masteri.name });
            }
            
        }
        product.findById(req.params.id).exec((err, product) => {
            console.log(product);
            res.render('createproduct.ejs', { user: req.user, moment: moment, hd_type: null, product: product, producttype: products });
        });
    });
});

router.post('/', isLoggedIn, function(req, res, next) {
    var newproduct = new product();
    newproduct.type = req.body.ddl_producttype;
    newproduct.productcode = req.body.txt_productcode;
    newproduct.name = req.body.txt_name;
    newproduct.brand = req.body.txt_brand;
    newproduct.series = req.body.txt_series;
    newproduct.size = req.body.txt_size;
   
    newproduct.remark = req.body.txt_remark;
    newproduct.orders = req.body.txt_orders;
    newproduct.warantyday = req.body.txt_warantyday;
    newproduct.warantymonth = req.body.txt_warantymonth;
    newproduct.warantyyear = req.body.txt_warantyyear;
    newproduct.warantyconditions = req.body.txt_warantycondition;
    newproduct.online = 1;
    newproduct.save(function(err) {
        if (err)
            throw err;
        res.redirect('/product');
    });
});

router.post('/:id', isLoggedIn, function(req, res, next) {
    console.log(req.body.txt_warantycondition);
    product.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            type: req.body.ddl_producttype,
            productcode: req.body.txt_productcode,
            name: req.body.txt_name,
            brand: req.body.txt_tirebrand,
            series: req.body.txt_tireseries,
            size: req.body.txt_tiresize,
            remark: req.body.txt_remark,
            orders: req.body.txt_orders,
            warantyday: req.body.txt_warantyday,
            warantymonth: req.body.txt_warantymonth,
            warantyyear: req.body.txt_warantyyear,
            warantyconditions: req.body.txt_warantycondition
        }
    }, { new: true }, function(err, doc) {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        res.redirect('/product');
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}