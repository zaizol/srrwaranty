var express = require('express');
var passport = require('passport');
var router = express.Router();
var Customer = require('../models/customer');
var Car = require('../models/car');
var moment = require('moment');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
    res.render('customerlist.ejs', { title: 's', user: req.user });
});
router.get('/loaddata', isLoggedIn, function(req, res, next) {
    var reports = [];
    var listcustomers = [];
    if (req.query.search != "") {
        if (req.query.searchmobile != "") {
            Car.find({ "carInfo.licenseNo": { $regex: req.query.search, $options: 'i' } }).lean().distinct('customerID').exec(function(err, carcustomers) {
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
            });
        }else{
            Car.find({ "carInfo.licenseNo": { $regex: req.query.search, $options: 'i' } }).lean().distinct('customerID').exec(function(err, carcustomers) {
                Customer.find().where('_id').in(carcustomers).exec(function(err, customers) {
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
            });

        }
        
    } else {
        if (req.query.searchmobile != "") {
            Customer.find({'customerInfo.mobile': { $regex: req.query.searchmobile, $options: 'i' } }).exec(function(err, customers) {
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
        }else{
            Customer.find().exec(function(err, customers) {
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

        }
        
    }
});


module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}