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
var Claim = require('../models/claims');
var moment = require('moment');


router.get('/', isLoggedIn, function(req, res) {
    Branch.find().exec(function(err, Branchs) {
    res.render('reportclaim.ejs', { user: req.user,moment:moment,branchs:Branchs });
});
});

router.get('/load', isLoggedIn, function(req, res) {

    var nextDate = req.query.txt_from;
    var nextchunks = nextDate.split('/');
    var next_date = [nextchunks[1], nextchunks[0], nextchunks[2]].join("/");
    var tonextDate = req.query.txt_to;
    var tonextchunks = tonextDate.split('/');
    var tonext_date = [tonextchunks[1], tonextchunks[0], tonextchunks[2]].join("/");
    console.log(req.query.branch);
        if (req.query.branch!= '')
        {
            Claim.find({'createdAt':{claimbranch:req.query.branch, $gte: next_date,$lte:  moment(tonext_date).endOf('day')}}).exec(function(err, claims) {
                var reports = [];
                 
                 console.log(claims);
                 for(var i in claims){
                    nclaim = claims[i];
                     reports.push({ claimbranch: nclaim.claimbranch,claimstatus:nclaim.claimstatus,claimbyname:nclaim.claimbyname,reasonclaim:nclaim.reasonclaim,claimdate:nclaim.claimdate,customer_contactname:nclaim.customer_contactname,customer_contactmobile:nclaim.customer_contactmobile,qty:nclaim.qty });    
                 }
                res.end(JSON.stringify(reports));
            });

        }else{

            Claim.find({'createdAt':{ $gte: next_date,$lte:  moment(tonext_date).endOf('day')}}).exec(function(err, claims) {
                var reports = [];
                 
                 console.log(claims);
                 for(var i in claims){
                    nclaim = claims[i];
                     reports.push({ claimbranch: nclaim.claimbranch,claimstatus:nclaim.claimstatus,claimbyname:nclaim.claimbyname,reasonclaim:nclaim.reasonclaim,claimdate:nclaim.claimdate,customer_contactname:nclaim.customer_contactname,customer_contactmobile:nclaim.customer_contactmobile,qty:nclaim.qty });    
                 }
                res.end(JSON.stringify(reports));
            });
        }
});



module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}