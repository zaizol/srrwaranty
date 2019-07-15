var express = require('express');
var passport = require('passport');
var router = express.Router();
var Customer = require('../models/customer');
var Car = require('../models/car');
var Job = require('../models/job');
var Joblist = require('../models/joblist');
var Master = require('../models/masters');
var Carbrand = require('../models/carbrand');
var Claim = require('../models/claims');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('checkwaranty.ejs', { title: 's' });
});
router.post('/getcustomer', function(req, res, next) {
    var reports = [];
    Car.find({ 'carInfo.licenseNo': req.body.searchtext }).populate('customerID').exec(function(err, carcustomers) {
        Customer.find({'customerInfo.mobile': { $regex: req.query.searchmobile, $options: 'i' } }).where('_id').in(carcustomers).exec(function(err, customers) {
            customers.forEach(function(x) { if (!listcustomers.includes(x._id)) listcustomers.push(x._id); });
            Car.find({}).where('customerID').in(listcustomers).exec(function(err, cars) {
                for (var i in customers) {
                    customer = customers[i];
                    var licenNO = "";
                    for (var t in cars) {
                        car = cars[t];
                        if (car.customerID.equals(customer._id)) {
                            licenNO = licenNO + car.carInfo.licenseNo + ",";
                        }
                    }
                    reports.push({ id: customer._id, fullname: customer.customerInfo.name + " " + customer.customerInfo.lastname, mobile: customer.customerInfo.mobile, licenseNo: licenNO, lastservice: customer.LastServicedate });
                }
                res.end(JSON.stringify(reports));
            });
        });
        /*for (var i in carcustomers) {
            customer = carcustomers[i];
            reports.push({ id: customer.customerID._id, fullname: customer.customerID.customerInfo.name + " " + customer.customerID.customerInfo.lastname, mobile: customer.customerID.customerInfo.mobile });
        }
        res.end(JSON.stringify(reports));*/
    });
});

router.post('/getcar', function(req, res, next) {
    var reports = [];
    var listjobs = [];
    var claimfound = [];
    var status = '';
    var claimid = '';
    var claimqty = '';
    var allqty = '';
    Job.find({ customerID: req.body.cus_id }).exec(function(err, jobs_id) {
        jobs_id.forEach(function(x) { if (!listjobs.includes(x._id)) listjobs.push(x._id); });
        Joblist.find().where('jobID').in(listjobs).populate('productID').exec(function(err, Joblists) {
            Job.find().where('_id').in(listjobs).populate('carID').populate('branchID').sort({ 'carID': 1, 'branchID': 1, 'createdAt': -1 }).exec(function(err, jobs) {
                Claim.find({ 'customerID': req.body.cus_id }).populate('productID').exec(function(err, Claims) {
                    console.log(Claims);
                    for (var i in jobs) {
                        job = jobs[i];
                        for (var j in Joblists) {
                            Joblistj = Joblists[j];
                            if (Joblistj.jobID.equals(job._id)) {
                                allqty = Joblistj.qty;
                                claimfound = [];
                                for (var k in Claims) {
                                    Claimsk = Claims[k];
                                    if (Joblistj._id.equals(Claimsk.joblistID)) {
                                        status = Claimsk.claimstatus;
                                        claimid = Claimsk._id;
                                        claimqty = Claimsk.qty;
                                        allqty = allqty - claimqty;
                                        claimfound.push({ status: status, claimid: claimid, claimqty: claimqty });
                                    }
                                }
                                if (claimfound.length > 0) {
                                    for (var c in claimfound) {
                                        claimfoundc = claimfound[c];
                                        reports.push({ servicedate: job.createdAt, branch: job.branchID.BranchInfo.name, cardetail: job.carID.carInfo.brand + '/' + job.carID.carInfo.series, licenseNo: job.carID.carInfo.licenseNo, product: Joblistj.productID.name, qty: claimfoundc.claimqty, eow: Joblistj.eow, status: claimfoundc.status, claimid: claimfoundc.claimid });
                                    }
                                    if (allqty > 0) {
                                        reports.push({ servicedate: job.createdAt, branch: job.branchID.BranchInfo.name, cardetail: job.carID.carInfo.brand + '/' + job.carID.carInfo.series, licenseNo: job.carID.carInfo.licenseNo, product: Joblistj.productID.name, qty: allqty, eow: Joblistj.eow, status: "", claimid: "" });
                                    }
                                } else {
                                    reports.push({ servicedate: job.createdAt, branch: job.branchID.BranchInfo.name, cardetail: job.carID.carInfo.brand + '/' + job.carID.carInfo.series, licenseNo: job.carID.carInfo.licenseNo, product: Joblistj.productID.name, qty: Joblistj.qty, eow: Joblistj.eow, status: status, claimid: claimid });
                                }
                            }
                        }
                        res.end(JSON.stringify(reports));
                    }
                });
            });
        });
    });
});
module.exports = router;