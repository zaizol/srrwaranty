var express = require('express');
var passport = require('passport');
var router = express.Router();
var Customer = require('../models/customer');
var Car = require('../models/car');
var Job = require('../models/job');
var Joblist = require('../models/joblist');
var Master = require('../models/masters');
var Carbrand = require('../models/carbrand');
var moment = require('moment');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
    Carbrand.find().exec(function(err, brands) {
        res.render('customerdetail.ejs', { title: 's', user: req.user, customer: null, cars: null, brands: brands });
    });
});

router.get('/:id', isLoggedIn, function(req, res, next) {
    Carbrand.find().exec(function(err, brands) {
        Customer.findById(req.params.id).exec(function(err, customers) {
            res.render('customerdetail.ejs', { title: 's', user: req.user, customer: customers, cars: null, brands: brands });
        });
    });
});

router.get('/loadcar/:id', isLoggedIn, function(req, res, next) {
    var reports = [];
    Car.find({ customerID: req.params.id }).exec(function(err, cars) {
        for (var i in cars) {
            val = cars[i];
            reports.push({ brand: val.carInfo.brand, series: val.carInfo.series, licenseNo: val.carInfo.licenseNo, mileage: val.carInfo.mileage, caryear: val.carInfo.caryear });
        }
        res.end(JSON.stringify(reports));
    });
});

router.get('/loadservicehis/:id', isLoggedIn, function(req, res, next) {
    var reports = [];
    var listjobs = [];
    Job.find({ customerID: req.params.id }).exec(function(err, jobs_id) {
        if (jobs_id != null) {
            jobs_id.forEach(function(x) { if (!listjobs.includes(x._id)) listjobs.push(x._id); });
            Joblist.find().where('jobID').in(listjobs).populate('productID').exec(function(err, Joblists) {
                Job.find().where('_id').in(listjobs).populate('carID').populate('branchID').exec(function(err, jobs) {

                    for (var i in jobs) {
                        job = jobs[i];
                        for (var j in Joblists) {
                            Joblistj = Joblists[j];
                            if (Joblistj.jobID.equals(job._id)) {
                                reports.push({ servicedate: job.createdAt, branch: job.branchID.BranchInfo.name, cardetail: job.carID.carInfo.brand + '/' + job.carID.carInfo.series, licenseNo: job.carID.carInfo.licenseNo, mileage: job.mileage, product: Joblistj.productID.name, qty: Joblistj.qty, eow: Joblistj.eow, warantyconditions: Joblistj.warantyconditions, JoblistjID: Joblistj._id,yearweek: Joblistj.yearweek });
                            }
                        }
                    }
                    res.end(JSON.stringify(reports));
                });
            });

        } else {
            res.end(JSON.stringify(reports));

        }

    });
});




module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}