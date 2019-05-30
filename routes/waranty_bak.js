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

router.get('/', isLoggedIn, function(req, res, next) {
    Master.find().sort({ 'type': 1, 'orders': 1 }).exec(function(err, masters) {
        var products = [];
        var warantyconditions = [];
        var tirebrand = [];
        var tireseries = [];
        var wheelbrand = [];
        var wheelseries = [];
        var PCD = [];
        var Offset = [];
        var wheelsize = [];
        var tiresize = [];
        for (var i in masters) {
            masteri = masters[i];
            if (masteri.type == "producttype") {
                products.push({ value: masteri.name });
            }
            if (masteri.type == "warantycondition") {
                warantyconditions.push({ value: masteri.name });
            }
            if (masteri.type == "tirebrand") {
                tirebrand.push({ value: masteri.name });
            }
            if (masteri.type == "tireseries") {
                tireseries.push({ value: masteri.name });
            }
            if (masteri.type == "wheelbrand") {
                wheelbrand.push({ value: masteri.name });
            }
            if (masteri.type == "wheelseries") {
                wheelseries.push({ value: masteri.name });
            }
            if (masteri.type == "PCD") {
                PCD.push({ value: masteri.name });
            }
            if (masteri.type == "OFFSET") {
                Offset.push({ value: masteri.name });
            }
            if (masteri.type == "wheelsize") {
                wheelsize.push({ value: masteri.name });
            }
            if (masteri.type == "tiresize") {
                tiresize.push({ value: masteri.name });
            }
        }
        res.render('waranty.ejs', { user: req.user, moment: moment, customer: null, cars: null, producttype: products, warantyconditions: warantyconditions, tirebrand: tirebrand, tireseries: tireseries, wheelbrand: wheelbrand, wheelseries: wheelseries, PCD: PCD, Offset: Offset, wheelsize: wheelsize, tiresize: tiresize });
    });
});
router.get('/:id', isLoggedIn, function(req, res, next) {
    Master.find().sort({ 'type': 1, 'orders': 1 }).exec(function(err, masters) {
        var products = [];
        var warantyconditions = [];
        var tirebrand = [];
        var tireseries = [];
        var wheelbrand = [];
        var wheelseries = [];
        var PCD = [];
        var Offset = [];
        var wheelsize = [];
        var tiresize = [];
        for (var i in masters) {
            masteri = masters[i];
            if (masteri.type == "producttype") {
                products.push({ value: masteri.name });
            }
            if (masteri.type == "warantycondition") {
                warantyconditions.push({ value: masteri.name });
            }
            if (masteri.type == "tirebrand") {
                tirebrand.push({ value: masteri.name });
            }
            if (masteri.type == "tireseries") {
                tireseries.push({ value: masteri.name });
            }
            if (masteri.type == "wheelbrand") {
                wheelbrand.push({ value: masteri.name });
            }
            if (masteri.type == "wheelseries") {
                wheelseries.push({ value: masteri.name });
            }
            if (masteri.type == "PCD") {
                PCD.push({ value: masteri.name });
            }
            if (masteri.type == "OFFSET") {
                Offset.push({ value: masteri.name });
            }
            if (masteri.type == "wheelsize") {
                wheelsize.push({ value: masteri.name });
            }
            if (masteri.type == "tiresize") {
                tiresize.push({ value: masteri.name });
            }
        }
        Customer.findById(req.params.id).exec(function(err, customer) {
            Car.find({ customerID: req.params.id }).exec(function(err, cars) {
                res.render('waranty.ejs', { user: req.user, moment: moment, customer: customer, cars: cars, producttype: products, warantyconditions: warantyconditions, tirebrand: tirebrand, tireseries: tireseries, wheelbrand: wheelbrand, wheelseries: wheelseries, PCD: PCD, Offset: Offset, wheelsize: wheelsize, tiresize: tiresize });
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
    newJob.branchID = req.user.local.branch;
    newJob.mileage = req.body.mileage;
    newJob.save(function(err) {
        if (err)
            throw err;

        //update User sevice
        Customer.findByIdAndUpdate(req.body.cus_id, {
                '$set': {
                    "LastServicedate": now,
                    "ServiceHistoryInfo.Servicedate": now,
                    "ServiceHistoryInfo.branchID": req.user.local.branch,
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
            newJoblist.warantyconditions = producte.warantyconditions;
            newJoblist.save(function(err) {
                if (err)
                    throw err;
            });
        });
        res.send({ redirect: '/customerlist' });
    });
});


router.post('/Get_tireseries', isLoggedIn, function(req, res, next) {
    product.find({ "type": "tire", "tirebrand": req.body.tirebrand }).lean().distinct('tireseries').exec((err, products) => {
        res.end(JSON.stringify(products));
    });
});

router.post('/Get_tiresize', isLoggedIn, function(req, res, next) {
    product.find({ "type": "tire", "tirebrand": req.body.tirebrand, "tireseries": req.body.tireseries }).lean().distinct('tiresize').exec((err, products) => {
        res.end(JSON.stringify(products));
    });
});

router.post('/Get_wheelseries', isLoggedIn, function(req, res, next) {
    product.find({ "type": "wheel", "wheelbrand": req.body.wheelbrand }).lean().distinct('wheelseries').exec((err, products) => {
        res.end(JSON.stringify(products));
    });
});

router.post('/Get_PCD', isLoggedIn, function(req, res, next) {
    product.find({ "type": "wheel", "wheelbrand": req.body.wheelbrand, "wheelseries": req.body.wheelseries }).lean().distinct('PCD').exec((err, products) => {
        res.end(JSON.stringify(products));
    });
});

router.post('/Get_Offset', isLoggedIn, function(req, res, next) {
    product.find({ "type": "wheel", "wheelbrand": req.body.wheelbrand, "wheelseries": req.body.wheelseries, "PCD": req.body.PCD }).lean().distinct('Offset').exec((err, products) => {
        res.end(JSON.stringify(products));
    });
});

router.post('/Get_wheelsize', isLoggedIn, function(req, res, next) {
    product.find({ "type": "wheel", "wheelbrand": req.body.wheelbrand, "wheelseries": req.body.wheelseries, "PCD": req.body.PCD, "Offset": req.body.Offset }).lean().distinct('wheelsize').exec((err, products) => {
        res.end(JSON.stringify(products));
    });
});


router.post('/search', isLoggedIn, function(req, res, next) {
    var reports = [];

    if (req.body.txt_name != "") {
        product.find({ name: { '$regex': req.body.txt_name } }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
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
        product.find({ "type": req.body.ddl_type, name: { '$regex': req.body.txt_name } }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
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

router.post('/searchtirebrand', isLoggedIn, function(req, res, next) {
    var reports = [];

    if (req.body.txt_name != "") {
        product.find({ "type": req.body.ddl_type, "tirebrand": req.body.ddl_tirebrand, name: { '$regex': req.body.txt_name } }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    } else {
        product.find({ "type": req.body.ddl_type, "tirebrand": req.body.ddl_tirebrand }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    }
});

router.post('/searchtireseries', isLoggedIn, function(req, res, next) {
    var reports = [];

    if (req.body.txt_name != "") {
        product.find({ "type": req.body.ddl_type, "tirebrand": req.body.ddl_tirebrand, "tireseries": req.body.ddl_tireseries, name: { '$regex': req.body.txt_name } }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    } else {
        product.find({ "type": req.body.ddl_type, "tirebrand": req.body.ddl_tirebrand, "tireseries": req.body.ddl_tireseries }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    }
});

router.post('/searchtiresize', isLoggedIn, function(req, res, next) {
    var reports = [];

    if (req.body.txt_name != "") {
        product.find({ "type": req.body.ddl_type, "tirebrand": req.body.ddl_tirebrand, "tireseries": req.body.ddl_tireseries, "tiresize": req.body.ddl_tiresize, name: { '$regex': req.body.txt_name } }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    } else {
        product.find({ "type": req.body.ddl_type, "tirebrand": req.body.ddl_tirebrand, "tireseries": req.body.ddl_tireseries, "tiresize": req.body.ddl_tiresize }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    }
});

router.post('/searchwheelbrand', isLoggedIn, function(req, res, next) {
    var reports = [];

    if (req.body.txt_name != "") {
        product.find({ "type": req.body.ddl_type, "wheelbrand": req.body.ddl_wheelbrand, name: { '$regex': req.body.txt_name } }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    } else {
        product.find({ "type": req.body.ddl_type, "wheelbrand": req.body.ddl_wheelbrand }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    }
});

router.post('/searchwheelseries', isLoggedIn, function(req, res, next) {
    var reports = [];

    if (req.body.txt_name != "") {
        product.find({ "type": req.body.ddl_type, "wheelbrand": req.body.ddl_wheelbrand, "wheelseries": req.body.ddl_wheelseries, name: { '$regex': req.body.txt_name } }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    } else {
        product.find({ "type": req.body.ddl_type, "wheelbrand": req.body.ddl_wheelbrand, "wheelseries": req.body.ddl_wheelseries }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    }
});

router.post('/searchPCD', isLoggedIn, function(req, res, next) {
    var reports = [];

    if (req.body.txt_name != "") {
        product.find({ "type": req.body.ddl_type, "wheelbrand": req.body.ddl_wheelbrand, "wheelseries": req.body.ddl_wheelseries, "PCD": req.body.ddl_PCD, name: { '$regex': req.body.txt_name } }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    } else {
        product.find({ "type": req.body.ddl_type, "wheelbrand": req.body.ddl_wheelbrand, "wheelseries": req.body.ddl_wheelseries, "PCD": req.body.ddl_PCD }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    }
});

router.post('/searchOffset', isLoggedIn, function(req, res, next) {
    var reports = [];

    if (req.body.txt_name != "") {
        product.find({ "type": req.body.ddl_type, "wheelbrand": req.body.ddl_wheelbrand, "wheelseries": req.body.ddl_wheelseries, "PCD": req.body.ddl_PCD, "Offset": req.body.ddl_Offset, name: { '$regex': req.body.txt_name } }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    } else {
        product.find({ "type": req.body.ddl_type, "wheelbrand": req.body.ddl_wheelbrand, "wheelseries": req.body.ddl_wheelseries, "PCD": req.body.ddl_PCD, "Offset": req.body.ddl_Offset }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    }
});

router.post('/searchwheelsize', isLoggedIn, function(req, res, next) {
    var reports = [];

    if (req.body.txt_name != "") {
        product.find({ "type": req.body.ddl_type, "wheelbrand": req.body.ddl_wheelbrand, "wheelseries": req.body.ddl_wheelseries, "PCD": req.body.ddl_PCD, "Offset": req.body.ddl_Offset, "wheelsize": req.body.ddl_wheelsize, name: { '$regex': req.body.txt_name } }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
            for (var t in products) {
                producti = products[t];
                reports.push({ id: producti._id, name: producti.name, remark: producti.remark, days: producti.warantyday, months: producti.warantymonth, years: producti.warantyyear, warantyconditions: producti.warantyconditions });
            }
            res.end(JSON.stringify(reports));
        })
    } else {
        product.find({ "type": req.body.ddl_type, "wheelbrand": req.body.ddl_wheelbrand, "wheelseries": req.body.ddl_wheelseries, "PCD": req.body.ddl_PCD, "Offset": req.body.ddl_Offset, "wheelsize": req.body.ddl_wheelsize }).sort({ 'type': 1, 'orders': 1 }).exec((err, products) => {
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