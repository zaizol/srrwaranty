var express = require('express');
var passport = require('passport');
var router = express.Router();
var Customer = require('../models/customer');
var Car = require('../models/car');
var Master = require('../models/masters');
var Carbrand = require('../models/carbrand');
var moment = require('moment');

/* GET home page. */
router.get('/:id', isLoggedIn, function(req, res, next) {
    Customer.findById(req.params.id).exec(function(err, customer) {
            Carbrand.find().exec(function(err, brands) {
            res.render('customeredit.ejs', { title: 'แก้ไขข้อมูล', user: req.user, cars: null, brands: brands,customer:customer });
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

router.post('/checkcus', isLoggedIn, function(req, res, next) {
    Customer.find({'customerInfo.name':req.body.name,'customerInfo.lastname':req.body.lastname}).exec(function(err, Customers) {
        res.end(JSON.stringify(Customers));
    });
});

router.post('/update', isLoggedIn, function(req, res, next) {
    var now = new Date();

    if (req.body.customerID != '')
    {
        Customer.findOneAndUpdate({ _id: req.body.customerID }, {
            $set: {
                'customerInfo.name' : req.body.name,
                'customerInfo.lastname' : req.body.lastname, 
                'customerInfo.mobile' : req.body.mobile, 
                'customerInfo.facebook' : req.body.facebook, 
                'customerInfo.lineID' : req.body.lineID, 
            }
        }, { new: true }, function(err, doc) {
            if (err)  
            throw err;
        
        req.body.cars.forEach(function(car) {
            var newCar = new Car()
            newCar.customerID = req.body.customerID;
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

        res.send({ redirect: '/customerdetail/'+req.body.customerID });
    });
    }else{
        res.send({ redirect: '/customerlist/' });
    }


    
});


module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}