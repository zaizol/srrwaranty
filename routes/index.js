var express = require('express');
var passport = require('passport');
var router = express.Router();
var Customer = require('../models/customer');
var Branch = require('../models/branch');
var Master = require('../models/master');
var moment = require('moment');
var Excel = require('exceljs');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
var wb = new Excel.Workbook();
var path = require('path');
var filePath = path.resolve(__dirname,'sample.xlsx');

wb.xlsx.readFile(filePath).then(function(){
    res.render('index', { title: 'สรุปทั่วไป', acardcus: acardcus ? acardcus : null, registercus: registercus ? registercus : null, cancleplan: cancleplan ? cancleplan : null });
});


module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}