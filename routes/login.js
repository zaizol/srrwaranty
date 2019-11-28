var express = require('express');
var passport = require('passport');
var router = express.Router();
var Customer = require('../models/customer');
var User = require('../models/user');
var Branch = require('../models/branch');
var Carbrand = require('../models/carbrand');
var moment = require('moment');
var Excel = require('exceljs');
var Master = require('../models/masters');
var Product = require('../models/products');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {

    /*var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "Chevrolet";
    NewCarbrand.brandthainame = "เชฟโรเลต ";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });
    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "Ford";
    NewCarbrand.brandthainame = "ฟอร์ด";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });
    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "Honda";
    NewCarbrand.brandthainame = "ฮอนด้า";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });
    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "Hyundai";
    NewCarbrand.brandthainame = "ฮุนได";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });
    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "Isuzu";
    NewCarbrand.brandthainame = "อีซูซุ";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });
    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "KIA";
    NewCarbrand.brandthainame = "เกีย";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });
    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "Lexus";
    NewCarbrand.brandthainame = "เลกซัส";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });
    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "Mazda";
    NewCarbrand.brandthainame = "มาสด้า";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });
    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "Mercedes-benz";
    NewCarbrand.brandthainame = "เมอร์เซเดส-เบนซ์ ";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });
    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "MG";
    NewCarbrand.brandthainame = "เอ็มจี ";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });
    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "Mini";
    NewCarbrand.brandthainame = "มินิ";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });
    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "Mitsubishi";
    NewCarbrand.brandthainame = "มิตซูบิชิ";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });
    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "Nissan";
    NewCarbrand.brandthainame = "นิสสัน";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });
    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "Peugeot";
    NewCarbrand.brandthainame = "เปอโยต์";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });

    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "Proton";
    NewCarbrand.brandthainame = "โปรตอน";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });
    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "Suzuki";
    NewCarbrand.brandthainame = "ซูซูกิ";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });
    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "TATA";
    NewCarbrand.brandthainame = "ทาทา";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });
    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "Toyota";
    NewCarbrand.brandthainame = "โตโยต้า";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });
    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "Volkswagen";
    NewCarbrand.brandthainame = "โฟล์คสวาเกน";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });
    var NewCarbrand = new Carbrand();
    NewCarbrand.brand = "Volvo";
    NewCarbrand.brandthainame = "วอลโว่";
    NewCarbrand.save(function(err) {
        if (err)
            throw err;
    });*/

    Branch.find().exec(function(err, branchs) {
        if (err)
            throw err
        res.render('signup.ejs', { message: req.flash('signupMessage'), branch: branchs });
    });
});



/*router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', { user: req.user });
});*/

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/index',
    failureRedirect: '/',
    failureFlash: true,
}));


router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/index',
        failureRedirect: '/'
    }));


router.get('/index', isLoggedIn, function(req, res, next) {
    //var arr = [];
   // arr.push({ 'name': 'พระราม2', 'open': '08.00', 'close': '18.00', 'state': '', orders: 9 });
    /*arr.push({ 'name': 'สำนักงานใหญ่', 'open': '08.00', 'close': '18.00', 'state': '', orders: 1 });
    arr.push({ 'name': 'สุขสวัสดิ์', 'open': '08.00', 'close': '18.00', 'state': '', orders: 2 });
    arr.push({ 'name': 'ศรีนครินทร์', 'open': '08.00', 'close': '18.00', 'state': '', orders: 3 });
    arr.push({ 'name': 'หนามแดง', 'open': '08.00', 'close': '18.00', 'state': '', orders: 4 });
    arr.push({ 'name': 'ซอยมังกร', 'open': '08.00', 'close': '18.00', 'state': '', orders: 5 });
    arr.push({ 'name': 'ชลบุรี', 'open': '08.00', 'close': '18.00', 'state': '', orders: 6 });
    arr.push({ 'name': 'ชลบุรีบายพาส', 'open': '08.00', 'close': '18.00', 'state': '', orders: 7 });
    arr.push({ 'name': 'โกดัง', 'open': '08.00', 'close': '18.00', 'state': '', orders: 8 });*/

    /*Branch.remove(function(err, removed) {

        // where removed is the count of removed documents
    });*/
    /*arr.forEach(function(branchs) {
        var newBranch = new Branch()
        newBranch.BranchInfo.name = branchs.name;
        newBranch.BranchInfo.open = branchs.open;
        newBranch.BranchInfo.close = branchs.close;
        newBranch.BranchInfo.state = branchs.state;
        newBranch.orders = branchs.orders;

        newBranch.save(function(err) {
            if (err)
                throw err;
        });
        console.log();
    });
    console.log('add');*/

    /*var wb = new Excel.Workbook();
    var path = require('path');
    var filePath = path.resolve(__dirname,'../product.xlsx');

    wb.xlsx.readFile(filePath).then(function(){

    var sh = wb.getWorksheet("tires");
 
    for (i = 1; i <= sh.rowCount; i++) {
        console.log(sh.getRow(i).getCell(1).value);
        console.log(sh.getRow(i).getCell(2).value);
        console.log(sh.getRow(i).getCell(3).value);

        console.log(sh.getRow(i).getCell(7).value);
        console.log(sh.getRow(i).getCell(8).value);
        console.log(sh.getRow(i).getCell(9).value);

        console.log(sh.getRow(sh.rowCount).getCell(1).value);
        console.log(sh.getRow(sh.rowCount).getCell(2).value);
        console.log(sh.getRow(sh.rowCount).getCell(3).value);

        console.log(sh.getRow(sh.rowCount).getCell(7).value);
        console.log(sh.getRow(sh.rowCount).getCell(8).value);
        console.log(sh.getRow(sh.rowCount).getCell(9).value);
if (sh.getRow(i).getCell(1).value != '')
{
    var NewProduct = new Product();
    NewProduct.type = "wheel";

    
    NewProduct.productcode=sh.getRow(i).getCell(1).value;
    NewProduct.name = sh.getRow(i).getCell(2).value;
    NewProduct.brand=sh.getRow(i).getCell(3).value;
    NewProduct.series=sh.getRow(i).getCell(4).value;
    NewProduct.size=sh.getRow(i).getCell(5).value;
    NewProduct.ccode="";
    NewProduct.orders=i
    var warantyday=0; 
    if (sh.getRow(i).getCell(6).value != "")
    {
        warantyday=sh.getRow(i).getCell(6).value;
    }
    var warantymonth=0; 
    if (sh.getRow(i).getCell(7).value != "")
    {
        warantymonth=sh.getRow(i).getCell(7).value;
    }
    var warantyyear=0; 
    if (sh.getRow(i).getCell(8).value != "")
    {
        warantyyear=sh.getRow(i).getCell(8).value;
    }
    NewProduct.warantyday=warantyday;
    NewProduct.warantymonth=warantymonth;
    NewProduct.warantyyear=warantyyear;
    NewProduct.warantyconditions="";
    NewProduct.online=1;
    NewProduct.save(function(err) {
        if (err)
            console.log(err);
    }); 



    var NewProduct = new Product();
    NewProduct.type = "tire";

    
    NewProduct.productcode=sh.getRow(i).getCell(1).value;
    NewProduct.name = sh.getRow(i).getCell(2).value;
    NewProduct.brand=sh.getRow(i).getCell(3).value;
    NewProduct.series=sh.getRow(i).getCell(4).value;
    NewProduct.size=sh.getRow(i).getCell(5).value;
    NewProduct.ccode=sh.getRow(i).getCell(6).value;
    NewProduct.orders=i
    var warantyday=0; 
    if (sh.getRow(i).getCell(7).value != "")
    {
        warantyday=sh.getRow(i).getCell(7).value;
    }
    var warantymonth=0; 
    if (sh.getRow(i).getCell(8).value != "")
    {
        warantymonth=sh.getRow(i).getCell(8).value;
    }
    var warantyyear=0; 
    if (sh.getRow(i).getCell(9).value != "")
    {
        warantyyear=sh.getRow(i).getCell(9).value;
    }
    NewProduct.warantyday=warantyday;
    NewProduct.warantymonth=warantymonth;
    NewProduct.warantyyear=warantyyear;
    NewProduct.warantyconditions=sh.getRow(i).getCell(10).value;
    NewProduct.online=1;
    NewProduct.save(function(err) {
        if (err)
            console.log(err);
    }); 

}
        
        
        var NewMaster = new Master();
        NewMaster.type = sh.getRow(i).getCell(1).value;
        NewMaster.name = sh.getRow(i).getCell(2).value;
        NewMaster.remark="";
        NewMaster.orders=sh.getRow(i).getCell(3).value;
        NewMaster.online=1;
        NewMaster.save(function(err) {
            if (err)
                throw err;
        }); 


}

});*/

    switch (req.user.local.role) {
        case "1":
        res.redirect('/customerlist');
            //res.render('customerlist.ejs', { title: 'สรุปทั่วไป', user: req.user });
            break;
        case "2":
        res.redirect('/claimlistwh');
            //res.render('claimlistwh.ejs', { title: 'สรุปทั่วไป', user: req.user });
            break;

        default:
            res.render('index.ejs', { title: 'สรุปทั่วไป', user: req.user });
    }
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}