var express = require('express');
var passport = require('passport');
var router = express.Router();
var moment = require('moment');
var Master = require('../models/masters');


router.get('/', isLoggedIn, function(req, res, next) {
    res.render('master.ejs', { user: req.user, moment: moment, hd_type: null });
});

router.get('/gettype', isLoggedIn, function(req, res, next) {
    Master.find().lean().distinct('type').exec((err, masters) => {
        res.end(JSON.stringify(masters));
    });
});
router.post('/getmaster', isLoggedIn, function(req, res, next) {
    (req.body.ddl_type) ?
    Master.find({ "type": req.body.ddl_type }).sort({ 'type': 1, 'orders': 1 }).exec((err, masters) => {
            res.end(JSON.stringify(masters));
        }):
        Master.find().sort({ 'type': 1, 'orders': 1 }).exec((err, masters) => {
            res.end(JSON.stringify(masters));
        })
});

router.get('/delete/:id', isLoggedIn, function(req, res, next) {
    Master.findByIdAndRemove(req.params.id, function(err, offer) {
        if (err) { throw err; }
        // ...
        return res.redirect('/master');
    });
});

router.post('/addmaster', isLoggedIn, function(req, res, next) {
    var sorts = 1;
    Master.find({ "type": req.body.type }).sort({ sort: -1 }).limit(1).exec(function(err, item) {
        var master = new Master();
        master.type = req.body.type;
        master.name = req.body.name;
        master.remark = req.body.remark;
        master.online = 1;
        master.save(function(err) {
            if (err)
                throw err;
            res.end();
        });
    });
});


router.post('/', isLoggedIn, function(req, res, next) {
    var sorts = 1;
    Master.find({ "type": req.body.txt_type }).sort({ sort: -1 }).limit(1).exec(function(err, item) {
        var master = new Master();
        master.type = req.body.txt_type;
        master.name = req.body.txt_name;
        master.remark = req.body.txt_remark;
        master.online = 1;
        master.save(function(err) {
            if (err)
                throw err;
            res.redirect('/master');
        });
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}