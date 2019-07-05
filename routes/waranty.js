var express = require('express');
var passport = require('passport');
var router = express.Router();
var moment = require('moment');
var Master = require('../models/masters');
var Car = require('../models/car');
var Job = require('../models/job');
var Joblist = require('../models/joblist');
var Customer = require('../models/customer');
var product = require('../models/products');
var Branch = require('../models/branch');

router.get('/', isLoggedIn, function(req, res, next) {
    Branch.find().sort({  'orders': 1 }).exec(function(err, branchs) {
    Master.find().sort({ 'type': 1, 'orders': 1 }).exec(function(err, masters) {
        var products = [];
        for (var i in masters) {
            masteri = masters[i];
            if (masteri.type == "producttype") {
                products.push({ value: masteri.name });
            }
            
        }
        res.render('waranty.ejs', { user: req.user,userbranch:req.user.local.branch.toString(), moment: moment, customer: null, cars: null, producttype: products,branchs:branchs });
    });
});
});

router.get('/:id', isLoggedIn, function(req, res, next) {
    Branch.find().sort({  'orders': 1 }).exec(function(err, branchs) {
    Master.find().sort({ 'type': 1, 'orders': 1 }).exec(function(err, masters) {
        var products = [];
        for (var i in masters) {
            masteri = masters[i];
            if (masteri.type == "producttype") {
                products.push({ value: masteri.name });
            }
        }
        Customer.findById(req.params.id).exec(function(err, customer) {
            Car.find({ customerID: req.params.id }).exec(function(err, cars) {
                res.render('waranty.ejs', { user: req.user,userbranch:req.user.local.branch.toString(), moment: moment, customer: customer, cars: cars, producttype: products,branchs:branchs});
            });
        });
    });
});
});

router.post('/addproduct', isLoggedIn, function(req, res, next) {
    var reports = [];
    product.findById(req.body.product_id).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
        var fromdate = moment().startOf('day')
        var expired = moment(fromdate).add(products.warantyday, 'days').add(products.warantymonth, 'months').add(products.warantyyear, 'years');
        reports.push({ id: products._id, name: products.name, remark: products.remark, expired: expired, days: products.warantyday, months: products.warantymonth, years: products.warantyyear, warantyconditions: products.warantyconditions });
        res.end(JSON.stringify(reports));
    })
});

router.post('/warantyproduct', isLoggedIn, function(req, res, next) {
    var now = new Date();
    var newJob = Job();
    newJob.customerID = req.body.cus_id;
    newJob.carID = req.body.car;
    newJob.branchID = req.body.ddl_branch;
    newJob.mileage = req.body.mileage;
    newJob.branchname = req.body.branchname;
    newJob.salename =req.user.local.name+ ' ' +req.user.local.surname;

    newJob.save(function(err) {
        if (err)
            throw err;

        //update User sevice
        Customer.findByIdAndUpdate(req.body.cus_id, {
                '$set': {
                    "LastServicedate": now,
                    "ServiceHistoryInfo.Servicedate": now,
                    "ServiceHistoryInfo.branchID": req.body.ddl_branch,
                    "ServiceHistoryInfo.carID": req.body.car,
                    "ServiceHistoryInfo.jobID": newJob._id,
                }
            }, { new: true },
            function(err, numAffected) {
                console.log(numAffected);
            });
        // insert job list
        req.body.products.forEach(function(producte) {
            var newJoblist = Joblist();
            var fromdate = moment().startOf('day')
            var expired = moment(fromdate).add(producte.days, 'days').add(producte.months, 'months').add(producte.years, 'years');
            newJoblist.jobID = newJob._id;
            newJoblist.productID = producte.product_id;
            newJoblist.qty = producte.qty;
            newJoblist.sow = now;
            newJoblist.eow = expired;
            newJoblist.yearweek = producte.yearweek;
            newJoblist.warantyconditions = producte.warantyconditions;
            newJoblist.warantyconditionsselect = producte.warantyconditionsselect;

            newJoblist.customername = req.body.cusname;
            newJoblist.customercontact = req.body.cusmobile;
            newJoblist.customercar = req.body.carname;
            newJoblist.branchname = req.body.branchname;
            newJoblist.salename =req.user.local.name+ ' ' +req.user.local.surname;
            

            newJoblist.save(function(err) {
                if (err)
                    throw err;
            });
        });
        res.send({ redirect: '/customerlist' });
    });
});

router.post('/Get_warantycondition', isLoggedIn, function(req, res, next) {
    Master.find({ "type": "warantycondition"}).exec((err, masters) => {
        res.end(JSON.stringify(masters.sort()));
    });
});

router.post('/Get_brand', isLoggedIn, function(req, res, next) {
    product.find({ "type": req.body.ddl_type }).lean().distinct('brand').exec((err, products) => {
        res.end(JSON.stringify(products.sort()));
    });
});

router.post('/Get_series', isLoggedIn, function(req, res, next) {
    product.find({ "type": req.body.ddl_type, "brand": req.body.brand }).lean().distinct('series').exec((err, products) => {
        res.end(JSON.stringify(products.sort()));
    });
});

router.post('/Get_size', isLoggedIn, function(req, res, next) {
    product.find({ "type": req.body.ddl_type, "brand": req.body.brand, "series": req.body.series }).lean().distinct('size').exec((err, products) => {
        res.end(JSON.stringify(products.sort()));
    });
});



router.post('/search', isLoggedIn, function(req, res, next) {
    var reports = [];

    if (req.body.txt_name != "") {
        product.find({ $or:[{ name: { '$regex': req.body.txt_name }}, {productcode: { '$regex': req.body.txt_name }}]  }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    } else {
        product.find({}).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    }
});

router.post('/searchtype', isLoggedIn, function(req, res, next) {
    var reports = [];

    if (req.body.txt_name != "") {
        product.find({ "type": req.body.ddl_type, $or:[{ name: { '$regex': req.body.txt_name }}, { productcode: { '$regex': req.body.txt_name }}]  }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    } else {
        product.find({ "type": req.body.ddl_type }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    }
});

router.post('/searchbrand', isLoggedIn, function(req, res, next) {
    var reports = [];

    if (req.body.txt_name != "") {
        product.find({ "type": req.body.ddl_type, "brand": req.body.ddl_brand, $or:[{ name: { '$regex': req.body.txt_name }}, { productcode: { '$regex': req.body.txt_name }}]  }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    } else {
        product.find({ "type": req.body.ddl_type, "brand": req.body.ddl_brand }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    }
});

router.post('/searchseries', isLoggedIn, function(req, res, next) {
    var reports = [];

    if (req.body.txt_name != "") {
        product.find({ "type": req.body.ddl_type, "brand": req.body.ddl_brand, "series": req.body.ddl_series, $or:[{ name: { '$regex': req.body.txt_name }}, { productcode: { '$regex': req.body.txt_name }}]  }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    } else {
        product.find({ "type": req.body.ddl_type, "brand": req.body.ddl_brand, "series": req.body.ddl_series }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    }
});

router.post('/searchsize', isLoggedIn, function(req, res, next) {
    var reports = [];

    if (req.body.txt_name != "") {
        product.find({ "type": req.body.ddl_type, "brand": req.body.ddl_brand, "series": req.body.ddl_series, "size": req.body.ddl_size, $or:[{ name: { '$regex': req.body.txt_name }}, { productcode: { '$regex': req.body.txt_name }}]  }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    } else {
        product.find({ "type": req.body.ddl_type, "brand": req.body.ddl_brand, "series": req.body.ddl_series, "size": req.body.ddl_size }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    }
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}