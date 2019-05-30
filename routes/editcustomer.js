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
        Master.find().sort({ 'type': 1, 'orders': 1 }).exec(function(err, masters) {
            var pcd = [];
            var wheelsize = [];
            var Offset = [];
            for (var i in masters) {
                masteri = masters[i];
                if (masteri.type == "PCD") {
                    pcd.push({ value: masteri.name });
                }
                if (masteri.type == "wheelsize") {
                    wheelsize.push({ value: masteri.name });
                }
                if (masteri.type == "Offset") {
                    Offset.push({ value: masteri.name });
                }
            }
            res.render('customerdetail.ejs', { title: 's', user: req.user, customer: null, cars: null, brands: brands, pcd: pcd, wheelsize: wheelsize, Offset: Offset });
        });
    });
});

router.get('/:id', isLoggedIn, function(req, res, next) {
    Carbrand.find().exec(function(err, brands) {
        Customer.findById(req.params.id).exec(function(err, customers) {
            Master.find().sort({ 'type': 1, 'orders': 1 }).exec(function(err, masters) {
                var pcd = [];
                var wheelsize = [];
                var Offset = [];
                for (var i in masters) {
                    masteri = masters[i];
                    if (masteri.type == "PCD") {
                        pcd.push({ value: masteri.name });
                    }
                    if (masteri.type == "wheelsize") {
                        wheelsize.push({ value: masteri.name });
                    }
                    if (masteri.type == "Offset") {
                        Offset.push({ value: masteri.name });
                    }
                }
                res.render('customerdetail.ejs', { title: 's', user: req.user, customer: customers, cars: null, brands: brands, pcd: pcd, wheelsize: wheelsize, Offset: Offset });
            });
        });
    });
});

router.get('/loadcar/:id', isLoggedIn, function(req, res, next) {
    var reports = [];
    Car.find({ customerID: req.params.id }).exec(function(err, cars) {
        for (var i in cars) {
            val = cars[i];
            reports.push({ brand: val.carInfo.brand, series: val.carInfo.series, licenseNo: val.carInfo.licenseNo, mileage: val.carInfo.mileage, pcd: val.carInfo.pcd, offset: val.carInfo.offset, wheelsize: val.carInfo.wheelsize });
        }
        res.end(JSON.stringify(reports));
    });
});


router.get('/loadservicehis/:id', isLoggedIn, function(req, res, next) {
    var reports = [];
    var listjobs = [];
    Job.find({ customerID: req.params.id }).exec(function(err, jobs_id) {
        jobs_id.forEach(function(x) { if (!listjobs.includes(x._id)) listjobs.push(x._id); });
        Joblist.find().where('jobID').in(listjobs).populate('productID').exec(function(err, Joblists) {
            Job.find().where('_id').in(listjobs).populate('carID').populate('branchID').exec(function(err, jobs) {

                for (var i in jobs) {
                    job = jobs[i];
                    for (var j in Joblists) {
                        Joblistj = Joblists[j];
                        if (Joblistj.jobID.equals(job._id)) {
                            reports.push({ servicedate: job.createdAt, branch: job.branchID.BranchInfo.name, cardetail: job.carID.carInfo.brand + '/' + job.carID.carInfo.series, licenseNo: job.carID.carInfo.licenseNo, product: Joblistj.productID.name, qty: Joblistj.qty, eow: Joblistj.eow });
                        }
                    }
                }
                res.end(JSON.stringify(reports));
            });
        });
    });
});

router.post('/update', isLoggedIn, function(req, res, next) {
    var now = new Date();
    Customer.findById(req.body.id).exec(function(err, customer) {
        customer.customerInfo.name = req.body.name;
        customer.customerInfo.lastname = req.body.lastname;
        customer.customerInfo.mobile = req.body.mobile;
        customer.customerInfo.facebook = req.body.facebook;
        customer.customerInfo.lineID = req.body.lineID;
        customer.save(function(err) {
            if (err)
                throw err;
            //delete old car
            Car.remove({ customerID: req.body.id }, function(err) {
                if (err)
                    throw err;
            })
            req.body.cars.forEach(function(car) {
                var newCar = new Car()
                newCar.customerID = req.body.id;
                newCar.carInfo.brand = car.carbrand;
                newCar.carInfo.series = car.carseries;
                newCar.carInfo.licenseNo = car.licenseNo;
                newCar.carInfo.mileage = car.mileage;
                newCar.carInfo.pcd = car.pcd;
                newCar.carInfo.offset = car.offset;
                newCar.carInfo.wheelsize = car.wheelsize;
                newCar.save(function(err) {
                    if (err)
                        throw err;
                });
            });
            res.send({ redirect: '/customerlist' });
        });

    });
});


module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}