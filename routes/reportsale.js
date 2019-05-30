var express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var router = express.Router();
var User = require('../models/user');
var Customer = require('../models/customer');
var Branch = require('../models/branch');
var moment = require('moment');

router.get('/', isLoggedIn, function(req, res) {
    res.render('reportsale.ejs', { user: req.user,moment:moment });
});

router.get('/load', isLoggedIn, function(req, res) {
    var nextDate = req.query.txt_from;
    var nextchunks = nextDate.split('/');
    var next_date = [nextchunks[1], nextchunks[0], nextchunks[2]].join("/");
    var tonextDate = req.query.txt_to;
    var tonextchunks = tonextDate.split('/');
    var tonext_date = [tonextchunks[1], tonextchunks[0], tonextchunks[2]].join("/");
    var branch = req.query.branch;

    User.find({'local.branch':branch}).exec(function(err, users) {
            Customer.find({ 'RegisterInfo.dateofRegister':{ $gt: next_date,$lt:  moment(tonext_date).endOf('day')}}).exec(function(err, customers) {
                var reports = [];
                 var qty=0;
                for (var i in users) {
                    user = users[i];
                        qty=0;
                        for (var j in customers) {
                            customer = customers[j];
                            if (customer.RegisterInfo.createby.equals(user._id)){
                                qty=qty+1;     
                            }  
                        }
                        reports.push({ name: user.local.name+ ' ' +user.local.surname, id: user._id,qty:qty });
                    } 
                res.end(JSON.stringify(reports));
            });
        });
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}