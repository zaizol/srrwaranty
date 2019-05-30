var express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var router = express.Router();
var User = require('../models/user');
var Customer = require('../models/customer');
var Branch = require('../models/branch');
var Job = require('../models/job');
var moment = require('moment');


router.get('/', isLoggedIn, function(req, res) {
    res.render('reportwaranty.ejs', { user: req.user,moment:moment });
});


router.get('/load', isLoggedIn, function(req, res) {

    var nextDate = req.query.txt_from;
    var nextchunks = nextDate.split('/');
    var next_date = [nextchunks[1], nextchunks[0], nextchunks[2]].join("/");
    var tonextDate = req.query.txt_to;
    var tonextchunks = tonextDate.split('/');
    var tonext_date = [tonextchunks[1], tonextchunks[0], tonextchunks[2]].join("/");

    Branch.find().exec(function(err, branchs) {
            Job.find({ 'createdAt':{ $gte: next_date,$lte:  moment(tonext_date).endOf('day')}}).exec(function(err, jobs) {
                var reports = [];
                 var qty=0;
                 console.log(jobs);
                for (var i in branchs) {
                    branch = branchs[i];
                        qty=0;
                        for (var j in jobs) {
                            job = jobs[j];
                            if (job.branchID.equals(branch._id)){
                                qty=qty+1;     
                            }  
                        }
                        reports.push({ name: branch.BranchInfo.name, id: branch._id,qty:qty });
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