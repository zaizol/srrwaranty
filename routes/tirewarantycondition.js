var express = require('express');
var passport = require('passport');
var router = express.Router();
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('tirewarantycondition.ejs', { title: 's' });
});


module.exports = router;