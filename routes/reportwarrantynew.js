var express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var router = express.Router();
var User = require('../models/user');
var Customer = require('../models/customer');
var Branch = require('../models/branch');
var Job = require('../models/job');
var Joblist = require('../models/joblist');
var moment = require('moment');


router.get('/', isLoggedIn, function(req, res) {
    res.render('reportwarrantynew.ejs', { user: req.user,moment:moment });
});


router.get('/load', isLoggedIn, function(req, res) {


    var nextDate = req.query.txt_from;
    var nextchunks = nextDate.split('/');
    var next_date = [nextchunks[1], nextchunks[0], nextchunks[2]].join("/");
    var tonextDate = req.query.txt_to;
    var tonextchunks = tonextDate.split('/');
    var tonext_date = [tonextchunks[1], tonextchunks[0], tonextchunks[2]].join("/");
    console.log(tonext_date);
        
            Joblist.find({'createdAt':{$gte: next_date,$lte:  moment(tonext_date).endOf('day')}}).populate('productID').exec(function(err, Joblists) {
                var reports = [];
                 
                 console.log(Joblists);
                 for(var i in Joblists){

                    NJoblists = Joblists[i];
                     reports.push({ customername: NJoblists.customername,
                        customercontact: NJoblists.customercontact,
                        customercar: NJoblists.customercar,
                        createdAt: NJoblists.createdAt,
                        branchname: NJoblists.branchname,
                        salename: NJoblists.salename,
                        sow: NJoblists.sow,
                        eow: NJoblists.eow,
                        warantyconditionsselect: NJoblists.warantyconditionsselect,
                        qty: NJoblists.qty,
                        productcode : NJoblists.productID.productcode,
                        productname : NJoblists.productID.name,
                    });    
                 }
                res.end(JSON.stringify(reports));
            });
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}