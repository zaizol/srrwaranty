var express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var router = express.Router();
var User = require('../models/user');
var Customer = require('../models/customer');
var Branch = require('../models/branch');
var Job = require('../models/job');
var Joblist = require('../models/joblist');
var Product = require('../models/products');
var moment = require('moment');


router.get('/', isLoggedIn, function(req, res) {
    res.render('reportwaranty_brand.ejs', { user: req.user,moment:moment });
});


router.get('/load', isLoggedIn, function(req, res) {

    var nextDate = req.query.txt_from;
    var nextchunks = nextDate.split('/');
    var next_date = [nextchunks[1], nextchunks[0], nextchunks[2]].join("/");
    var tonextDate = req.query.txt_to;
    var tonextchunks = tonextDate.split('/');
    var tonext_date = [tonextchunks[1], tonextchunks[0], tonextchunks[2]].join("/");
    var branch = req.query.branch;

    Product.find().lean().distinct('brand').exec(function(err, Products) {
            Job.find({ 'createdAt':{ $gte: next_date,$lte:  moment(tonext_date).endOf('day')},branchID:branch}).lean().distinct('_id').exec(function(err, jobs) {
                //Joblist.find().exec(function(err, joblists) {
                Joblist.find().where('jobID').in(jobs).populate({path: "productID"}).exec(function(err, joblists) {
                var reports = [];
                 var qty=0;
                 console.log(joblists);
                 for(var i in Products){
                    qty=0;
                    Product = Products[i];
                    for (var j in joblists) {
                        joblist = joblists[j];
                            if (Product==joblist.productID.brand && req.query.type==joblist.productID.type)
                            {
                                qty=qty+1;
                            }
                        
                    }
                    reports.push({ brand: Product,qty:qty });
                 }
                       
                        
                res.end(JSON.stringify(reports));
            });
        });
    });
});



module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}