var express = require('express');
var passport = require('passport');
var router = express.Router();
var moment = require('moment');
var Master = require('../models/masters');


router.get('/', isLoggedIn, function(req, res, next) {
    res.render('createmaster.ejs', { user: req.user, moment: moment, hd_type: null, master: null });
});
router.get('/:id', isLoggedIn, function(req, res, next) {
    Master.findById(req.params.id).exec((err, master) => {
        res.render('createmaster.ejs', { user: req.user, moment: moment, hd_type: null, master: master });
    });
});

router.post('/', isLoggedIn, function(req, res, next) {
    Master.find({ "type": req.body.type }).sort({ sort: -1 }).limit(1).exec(function(err, item) {
        var master = new Master();
        master.type = req.body.txt_type;
        master.name = req.body.txt_name;
        master.remark = req.body.txt_remark;
        master.orders = req.body.txt_orders;
        master.online = 1;
        master.save(function(err) {
            if (err)
                throw err;
            res.redirect('/master');
        });
    });
});

router.post('/:id', isLoggedIn, function(req, res, next) {
    Master.findOneAndUpdate({ _id: req.params.id }, { $set: { type: req.body.txt_type, name: req.body.txt_name, remark: req.body.txt_remark, orders: req.body.txt_orders } }, { new: true }, function(err, doc) {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        res.redirect('/master');
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}