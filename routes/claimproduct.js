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
var Branch = require('../models/branch');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
    Branch.find().sort({  'orders': 1 }).exec(function(err, branchs) {
    res.render('claimproduct.ejs', { title: 's', user: req.user,userbranch:req.user.local.branch.toString(), customer: null, moment: moment });
});
});

router.get('/:id', isLoggedIn, function(req, res, next) {
    Branch.find().sort({  'orders': 1 }).exec(function(err, branchs) {
    Joblist.findById(req.params.id).populate('productID').populate('jobID').exec(function(err, Joblistj) {
        Customer.findById(Joblistj.jobID.customerID).exec(function(err, customers) {
            Claim.find({ "joblistID": req.params.id }).exec(function(err, claims) {
                var claimqty = 0;
                for (var i in claims) {
                    val = claims[i];
                    claimqty = claimqty + val.qty;
                }
                var canclaiminqty = 0;
                canclaiminqty = Joblistj.qty - claimqty;
                res.render('claimproduct.ejs', {
                    title: 's',
                    user: req.user,
                    userbranch:req.user.local.branch.toString(),
                    customer: customers,
                    moment: moment,
                    productname: Joblistj.productID.name,
                    producttype: Joblistj.productID.type,
                    productproductcode: Joblistj.productID.productcode,
                    productbrand: Joblistj.productID.brand,
                    productseries: Joblistj.productID.series,
                    productsize: Joblistj.productID.size,
                    //productccode: claims.productID.ccode,
                    productremark: Joblistj.productID.remark,
                    qty: Joblistj.qty,
                    sow: Joblistj.sow,
                    eow: Joblistj.eow,
                    warantyconditions: Joblistj.warantyconditions,
                    warantyconditionsselect: Joblistj.warantyconditionsselect,
                    JoblistjID: Joblistj._id,
                    productID: Joblistj.productID._id,
                    claimqty: claimqty,
                    canclaiminqty: canclaiminqty,
                    branchs:branchs,
                    yearweek:Joblistj.yearweek,
                });
            });
        });
    });
});
});

router.post('/addclaim', isLoggedIn, function(req, res, next) {
    //insert
    var now = new Date();
    var newClaim = Claim();
    newClaim.joblistID = req.body.joblistID;
    newClaim.customerID = req.body.customerID;
    newClaim.productID = req.body.productID;
    newClaim.qty = req.body.qty;
    newClaim.customer_contactname = req.body.customer_contactname;
    newClaim.customer_contactmobile = req.body.customer_contactmobile;
    newClaim.claimdate = now;
    newClaim.claimby = req.user._id;
    newClaim.claimbyname = req.user.fullname;
    newClaim.claimstatus = 'OFFICER_SENDNEW';
    newClaim.claimbranch=req.body.branch;
    newClaim.reasonclaim =req.body.reasonclaim;
    newClaim.save(function(err) {
        if (err)
            throw err;
        res.send({ redirect: '/claimlist' });
    });
});


module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}