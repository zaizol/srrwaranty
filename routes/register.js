var express = require('express');
var passport = require('passport');
var router = express.Router();
var Customer = require('../models/customer');
var Car = require('../models/car');
var Master = require('../models/masters');
var Carbrand = require('../models/carbrand');
var moment = require('moment');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
    Carbrand.find().exec(function(err, brands) {
        res.render('register.ejs', { title: 'ลงทะเบียนรับประกันสินค้า', user: req.user, cars: null, brands: brands });
    });
});

router.post('/', isLoggedIn, function(req, res, next) {

    res.render('register.ejs', { title: 'ลงทะเบียนรับประกันสินค้า', user: req.user });
});

router.post('/checkcus', isLoggedIn, function(req, res, next) {
    Customer.find({'customerInfo.name':req.body.name,'customerInfo.lastname':req.body.lastname}).exec(function(err, Customers) {
        res.end(JSON.stringify(Customers));
    });
});

router.post('/create', isLoggedIn, function(req, res, next) {
    var now = new Date();
    var NewCustomer = new Customer();
    NewCustomer.customerInfo.name = req.body.name;
    NewCustomer.customerInfo.lastname = req.body.lastname;
    NewCustomer.customerInfo.mobile = req.body.mobile;
    NewCustomer.customerInfo.facebook = req.body.facebook;
    NewCustomer.customerInfo.lineID = req.body.lineID;
    NewCustomer.RegisterInfo.branchID = req.user.local.branch;
    NewCustomer.RegisterInfo.dateofRegister = now;
    NewCustomer.RegisterInfo.createby = req.user._id;
    NewCustomer.ActionBy= req.user._id;
    NewCustomer.LastServicedate = now;
    NewCustomer.save(function(err) {
        if (err)
            throw err;
        req.body.cars.forEach(function(car) {
            var newCar = new Car()
            newCar.customerID = NewCustomer._id;
            newCar.carInfo.brand = car.carbrand;
            newCar.carInfo.series = car.carseries;
            newCar.carInfo.licenseNo = car.licenseNo;
            newCar.carInfo.mileage = car.mileage;
            newCar.carInfo.caryear = car.caryear;
            newCar.save(function(err) {
                if (err)
                    throw err;
            });
        });

        /*res.redirect('/customerlist')*;*/
        res.send({ redirect: '/customerlist' });
    });
});


module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}