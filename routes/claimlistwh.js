var express = require('express');
var passport = require('passport');
var router = express.Router();
var Customer = require('../models/customer');
var Product = require('../models/products');
var Claim = require('../models/claims');
var Master = require('../models/masters');
var Branch = require('../models/branch');
var moment = require('moment');
var cors = require('cors');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
    Master.find().sort({ 'type': 1, 'orders': 1 }).exec(function(err, masters) {
        var supplier = [];
        for (var i in masters) {
            masteri = masters[i];
            if (masteri.type == "supplier") {
                supplier.push({ value: masteri.name });
            }
        }
        res.render('claimlistwh.ejs', { title: 's', user: req.user, momemt: moment, supplier: supplier });
    });
});

router.get('/loaddata', isLoggedIn, function(req, res, next) {
    var reports = [];

    console.log(req.query.txt_from);
    if (req.query.search != "") {
if(req.query.ddl_branch != ""){
    if(req.query.txt_from != "" && req.query.txt_to != ""){
        var nextDate = req.query.txt_from;
        var nextchunks = nextDate.split('/');
        var next_date = [nextchunks[1], nextchunks[0], nextchunks[2]].join("/");
        var tonextDate = req.query.txt_to;
        var tonextchunks = tonextDate.split('/');
        var tonext_date = [tonextchunks[1], tonextchunks[0], tonextchunks[2]].join("/");
        Claim.find({  'createdAt':{ $gte: next_date,$lte:  moment(tonext_date).endOf('day')},claimbranch:req.query.ddl_branch,
            $or: [{
                "claimstatus": "OFFICER_SENDNEW"
            }, { "claimstatus": "WAREHOUSE_RECEIVED" }, { "claimstatus": "WAREHOUSE_SEND" }, { "claimstatus": "SUPPLIER_RECEIVED" }, { "claimstatus": "SUPPLIER_REPLY" }, { "claimstatus": "warehouse_RECEIVED_SUP" }, { "claimstatus": "warehouse_REPLY" }],
            $or: [{ "customer_contactname": { $regex: req.query.search, $options: 'i' } }, { "customer_contactmobile": { $regex: req.query.search, $options: 'i' } }]
        }).populate('productID').exec(function(err, Claims) {
            for (var i in Claims) {
                claim = Claims[i];
                var claimstatusname = "";
                switch (claim.claimstatus) {
                    case "OFFICER_SENDNEW":
                        claimstatusname = "ส่งสินค้าไปยังโกดัง";
                        break;
                    case "WAREHOUSE_RECEIVED":
                        claimstatusname = "โกดังรับสินค้า";
                        break;
                    case "WAREHOUSE_SEND":
                        claimstatusname = "โกดังส่งไป SUPPLIER";
                        break;
                    case "SUPPLIER_RECEIVED":
                        claimstatusname = "SUPPLIER รับสินค้า";
                        break;
                    case "SUPPLIER_REPLY":
                        claimstatusname = "ส่งผลเคลม";
                        break;
                    case "warehouse_RECEIVED_SUP":
                        claimstatusname = "โกดังรับสินค้ากลับ";
                        break;
                    case "warehouse_REPLY":
                        claimstatusname = "โกดังส่งสินค้ากลับ";
                        break;
                    case "OFFICER_RECEIVED":
                        claimstatusname = "พนักงานรับสินค้ากลับ";
                        break;
                    case "OFFICER_APPOINTMENT":
                        claimstatusname = "นัดหมายลูกค้ารับสินค้า";
                        break;
                    case "warehouse_CLOSE":
                        claimstatusname = "บัญชี/โกดัง ปิดการเคลม";
                        break;
                    case "FINISH":
                        claimstatusname = "ลูกค้ารับสินค้า";
                        break;
                }
                reports.push({
                    id: claim._id,
                    customer_contactname: claim.customer_contactname,
                    customer_contactmobile: claim.customer_contactmobile,
                    product: claim.productID.name,
                    qty: claim.qty,
                    claimdate: claim.claimdate,
                    claimstatus: claim.claimstatus,
                    claimstatusname: claimstatusname,
                    claimbyname: claim.claimbyname,
                    claimbranch:claim.claimbranch
                });
            }
            res.end(JSON.stringify(reports));
        });
    }else{
    
        Claim.find({claimbranch:req.query.ddl_branch,
            $or: [{
                "claimstatus": "OFFICER_SENDNEW"
            }, { "claimstatus": "WAREHOUSE_RECEIVED" }, { "claimstatus": "WAREHOUSE_SEND" }, { "claimstatus": "SUPPLIER_RECEIVED" }, { "claimstatus": "SUPPLIER_REPLY" }, { "claimstatus": "warehouse_RECEIVED_SUP" }, { "claimstatus": "warehouse_REPLY" }],
            $or: [{ "customer_contactname": { $regex: req.query.search, $options: 'i' } }, { "customer_contactmobile": { $regex: req.query.search, $options: 'i' } }]
        }).populate('productID').exec(function(err, Claims) {
            for (var i in Claims) {
                claim = Claims[i];
                var claimstatusname = "";
                switch (claim.claimstatus) {
                    case "OFFICER_SENDNEW":
                        claimstatusname = "ส่งสินค้าไปยังโกดัง";
                        break;
                    case "WAREHOUSE_RECEIVED":
                        claimstatusname = "โกดังรับสินค้า";
                        break;
                    case "WAREHOUSE_SEND":
                        claimstatusname = "โกดังส่งไป SUPPLIER";
                        break;
                    case "SUPPLIER_RECEIVED":
                        claimstatusname = "SUPPLIER รับสินค้า";
                        break;
                    case "SUPPLIER_REPLY":
                        claimstatusname = "ส่งผลเคลม";
                        break;
                    case "warehouse_RECEIVED_SUP":
                        claimstatusname = "โกดังรับสินค้ากลับ";
                        break;
                    case "warehouse_REPLY":
                        claimstatusname = "โกดังส่งสินค้ากลับ";
                        break;
                    case "OFFICER_RECEIVED":
                        claimstatusname = "พนักงานรับสินค้ากลับ";
                        break;
                    case "OFFICER_APPOINTMENT":
                        claimstatusname = "นัดหมายลูกค้ารับสินค้า";
                        break;
                    case "warehouse_CLOSE":
                        claimstatusname = "บัญชี/โกดัง ปิดการเคลม";
                        break;
                    case "FINISH":
                        claimstatusname = "ลูกค้ารับสินค้า";
                        break;
                }
                reports.push({
                    id: claim._id,
                    customer_contactname: claim.customer_contactname,
                    customer_contactmobile: claim.customer_contactmobile,
                    product: claim.productID.name,
                    qty: claim.qty,
                    claimdate: claim.claimdate,
                    claimstatus: claim.claimstatus,
                    claimstatusname: claimstatusname,
                    claimbyname: claim.claimbyname,
                    claimbranch:claim.claimbranch
                });
            }
            res.end(JSON.stringify(reports));
        });
    }
}else{
    if(req.query.txt_from != "" && req.query.txt_to != ""){
        var nextDate = req.query.txt_from;
        var nextchunks = nextDate.split('/');
        var next_date = [nextchunks[1], nextchunks[0], nextchunks[2]].join("/");
        var tonextDate = req.query.txt_to;
        var tonextchunks = tonextDate.split('/');
        var tonext_date = [tonextchunks[1], tonextchunks[0], tonextchunks[2]].join("/");
        Claim.find({'createdAt':{ $gte: next_date,$lte:  moment(tonext_date).endOf('day')},
            $or: [{
                "claimstatus": "OFFICER_SENDNEW"
            }, { "claimstatus": "WAREHOUSE_RECEIVED" }, { "claimstatus": "WAREHOUSE_SEND" }, { "claimstatus": "SUPPLIER_RECEIVED" }, { "claimstatus": "SUPPLIER_REPLY" }, { "claimstatus": "warehouse_RECEIVED_SUP" }, { "claimstatus": "warehouse_REPLY" }],
            $or: [{ "customer_contactname": { $regex: req.query.search, $options: 'i' } }, { "customer_contactmobile": { $regex: req.query.search, $options: 'i' } }]
        }).populate('productID').exec(function(err, Claims) {
            for (var i in Claims) {
                claim = Claims[i];
                var claimstatusname = "";
                switch (claim.claimstatus) {
                    case "OFFICER_SENDNEW":
                        claimstatusname = "ส่งสินค้าไปยังโกดัง";
                        break;
                    case "WAREHOUSE_RECEIVED":
                        claimstatusname = "โกดังรับสินค้า";
                        break;
                    case "WAREHOUSE_SEND":
                        claimstatusname = "โกดังส่งไป SUPPLIER";
                        break;
                    case "SUPPLIER_RECEIVED":
                        claimstatusname = "SUPPLIER รับสินค้า";
                        break;
                    case "SUPPLIER_REPLY":
                        claimstatusname = "ส่งผลเคลม";
                        break;
                    case "warehouse_RECEIVED_SUP":
                        claimstatusname = "โกดังรับสินค้ากลับ";
                        break;
                    case "warehouse_REPLY":
                        claimstatusname = "โกดังส่งสินค้ากลับ";
                        break;
                    case "OFFICER_RECEIVED":
                        claimstatusname = "พนักงานรับสินค้ากลับ";
                        break;
                    case "OFFICER_APPOINTMENT":
                        claimstatusname = "นัดหมายลูกค้ารับสินค้า";
                        break;
                    case "warehouse_CLOSE":
                        claimstatusname = "บัญชี/โกดัง ปิดการเคลม";
                        break;
                    case "FINISH":
                        claimstatusname = "ลูกค้ารับสินค้า";
                        break;
                }
                reports.push({
                    id: claim._id,
                    customer_contactname: claim.customer_contactname,
                    customer_contactmobile: claim.customer_contactmobile,
                    product: claim.productID.name,
                    qty: claim.qty,
                    claimdate: claim.claimdate,
                    claimstatus: claim.claimstatus,
                    claimstatusname: claimstatusname,
                    claimbyname: claim.claimbyname,
                    claimbranch:claim.claimbranch
                });
            }
            res.end(JSON.stringify(reports));
        });
    }else{
    
        Claim.find({
            $or: [{
                "claimstatus": "OFFICER_SENDNEW"
            }, { "claimstatus": "WAREHOUSE_RECEIVED" }, { "claimstatus": "WAREHOUSE_SEND" }, { "claimstatus": "SUPPLIER_RECEIVED" }, { "claimstatus": "SUPPLIER_REPLY" }, { "claimstatus": "warehouse_RECEIVED_SUP" }, { "claimstatus": "warehouse_REPLY" }],
            $or: [{ "customer_contactname": { $regex: req.query.search, $options: 'i' } }, { "customer_contactmobile": { $regex: req.query.search, $options: 'i' } }]
        }).populate('productID').exec(function(err, Claims) {
            for (var i in Claims) {
                claim = Claims[i];
                var claimstatusname = "";
                switch (claim.claimstatus) {
                    case "OFFICER_SENDNEW":
                        claimstatusname = "ส่งสินค้าไปยังโกดัง";
                        break;
                    case "WAREHOUSE_RECEIVED":
                        claimstatusname = "โกดังรับสินค้า";
                        break;
                    case "WAREHOUSE_SEND":
                        claimstatusname = "โกดังส่งไป SUPPLIER";
                        break;
                    case "SUPPLIER_RECEIVED":
                        claimstatusname = "SUPPLIER รับสินค้า";
                        break;
                    case "SUPPLIER_REPLY":
                        claimstatusname = "ส่งผลเคลม";
                        break;
                    case "warehouse_RECEIVED_SUP":
                        claimstatusname = "โกดังรับสินค้ากลับ";
                        break;
                    case "warehouse_REPLY":
                        claimstatusname = "โกดังส่งสินค้ากลับ";
                        break;
                    case "OFFICER_RECEIVED":
                        claimstatusname = "พนักงานรับสินค้ากลับ";
                        break;
                    case "OFFICER_APPOINTMENT":
                        claimstatusname = "นัดหมายลูกค้ารับสินค้า";
                        break;
                    case "warehouse_CLOSE":
                        claimstatusname = "บัญชี/โกดัง ปิดการเคลม";
                        break;
                    case "FINISH":
                        claimstatusname = "ลูกค้ารับสินค้า";
                        break;
                }
                reports.push({
                    id: claim._id,
                    customer_contactname: claim.customer_contactname,
                    customer_contactmobile: claim.customer_contactmobile,
                    product: claim.productID.name,
                    qty: claim.qty,
                    claimdate: claim.claimdate,
                    claimstatus: claim.claimstatus,
                    claimstatusname: claimstatusname,
                    claimbyname: claim.claimbyname,
                    claimbranch:claim.claimbranch
                });
            }
            res.end(JSON.stringify(reports));
        });
    }
}  
    } else {
        if(req.query.ddl_branch != ""){
            if(req.query.txt_from != "" && req.query.txt_to != ""){
                var nextDate = req.query.txt_from;
    var nextchunks = nextDate.split('/');
    var next_date = [nextchunks[1], nextchunks[0], nextchunks[2]].join("/");
    var tonextDate = req.query.txt_to;
    var tonextchunks = tonextDate.split('/');
    var tonext_date = [tonextchunks[1], tonextchunks[0], tonextchunks[2]].join("/");
                Claim.find({'createdAt':{ $gte: next_date,$lte:  moment(tonext_date).endOf('day')},claimbranch:req.query.ddl_branch,
                    $or: [{
                        "claimstatus": "OFFICER_SENDNEW"
                    }, { "claimstatus": "WAREHOUSE_RECEIVED" }, { "claimstatus": "WAREHOUSE_SEND" }, { "claimstatus": "SUPPLIER_RECEIVED" }, { "claimstatus": "SUPPLIER_REPLY" }, { "claimstatus": "warehouse_RECEIVED_SUP" }, { "claimstatus": "warehouse_REPLY" }]
                }).populate('productID').exec(function(err, Claims) {
                    for (var i in Claims) {
                        claim = Claims[i];
                        var claimstatusname = "";
                        switch (claim.claimstatus) {
                            case "OFFICER_SENDNEW":
                                claimstatusname = "ส่งสินค้าไปยังโกดัง";
                                break;
                            case "WAREHOUSE_RECEIVED":
                                claimstatusname = "โกดังรับสินค้า";
                                break;
                            case "WAREHOUSE_SEND":
                                claimstatusname = "โกดังส่งไป SUPPLIER";
                                break;
                            case "SUPPLIER_RECEIVED":
                                claimstatusname = "SUPPLIER รับสินค้า";
                                break;
                            case "SUPPLIER_REPLY":
                                claimstatusname = "ส่งผลเคลม";
                                break;
                            case "warehouse_RECEIVED_SUP":
                                claimstatusname = "โกดังรับสินค้ากลับ";
                                break;
                            case "warehouse_REPLY":
                                claimstatusname = "โกดังส่งสินค้ากลับ";
                                break;
                            case "OFFICER_RECEIVED":
                                claimstatusname = "พนักงานรับสินค้ากลับ";
                                break;
                            case "OFFICER_APPOINTMENT":
                                claimstatusname = "นัดหมายลูกค้ารับสินค้า";
                                break;
                            case "warehouse_CLOSE":
                                claimstatusname = "บัญชี/โกดัง ปิดการเคลม";
                                break;
                            case "FINISH":
                                claimstatusname = "ลูกค้ารับสินค้า";
                                break;
                        }
                        
                        reports.push({
                            id: claim._id,
                            customer_contactname: claim.customer_contactname,
                            customer_contactmobile: claim.customer_contactmobile,
                            product: claim.productID.name,
                            qty: claim.qty,
                            claimdate: claim.claimdate,
                            claimstatus: claim.claimstatus,
                            claimstatusname: claimstatusname,
                            claimbyname: claim.claimbyname,
                            claimbranch:claim.claimbranch
                        });
                    }
                    res.end(JSON.stringify(reports));
                });
        
            }else{
            
                Claim.find({claimbranch:req.query.ddl_branch,
                    $or: [{
                        "claimstatus": "OFFICER_SENDNEW"
                    }, { "claimstatus": "WAREHOUSE_RECEIVED" }, { "claimstatus": "WAREHOUSE_SEND" }, { "claimstatus": "SUPPLIER_RECEIVED" }, { "claimstatus": "SUPPLIER_REPLY" }, { "claimstatus": "warehouse_RECEIVED_SUP" }, { "claimstatus": "warehouse_REPLY" }]
                }).populate('productID').exec(function(err, Claims) {
                    for (var i in Claims) {
                        claim = Claims[i];
                        var claimstatusname = "";
                        switch (claim.claimstatus) {
                            case "OFFICER_SENDNEW":
                                claimstatusname = "ส่งสินค้าไปยังโกดัง";
                                break;
                            case "WAREHOUSE_RECEIVED":
                                claimstatusname = "โกดังรับสินค้า";
                                break;
                            case "WAREHOUSE_SEND":
                                claimstatusname = "โกดังส่งไป SUPPLIER";
                                break;
                            case "SUPPLIER_RECEIVED":
                                claimstatusname = "SUPPLIER รับสินค้า";
                                break;
                            case "SUPPLIER_REPLY":
                                claimstatusname = "ส่งผลเคลม";
                                break;
                            case "warehouse_RECEIVED_SUP":
                                claimstatusname = "โกดังรับสินค้ากลับ";
                                break;
                            case "warehouse_REPLY":
                                claimstatusname = "โกดังส่งสินค้ากลับ";
                                break;
                            case "OFFICER_RECEIVED":
                                claimstatusname = "พนักงานรับสินค้ากลับ";
                                break;
                            case "OFFICER_APPOINTMENT":
                                claimstatusname = "นัดหมายลูกค้ารับสินค้า";
                                break;
                            case "warehouse_CLOSE":
                                claimstatusname = "บัญชี/โกดัง ปิดการเคลม";
                                break;
                            case "FINISH":
                                claimstatusname = "ลูกค้ารับสินค้า";
                                break;
                        }
                        
                        reports.push({
                            id: claim._id,
                            customer_contactname: claim.customer_contactname,
                            customer_contactmobile: claim.customer_contactmobile,
                            product: claim.productID.name,
                            qty: claim.qty,
                            claimdate: claim.claimdate,
                            claimstatus: claim.claimstatus,
                            claimstatusname: claimstatusname,
                            claimbyname: claim.claimbyname,
                            claimbranch:claim.claimbranch
                        });
                    }
                    res.end(JSON.stringify(reports));
                });
            }
        }else{
            if(req.query.txt_from != "" && req.query.txt_to != ""){
                var nextDate = req.query.txt_from;
    var nextchunks = nextDate.split('/');
    var next_date = [nextchunks[1], nextchunks[0], nextchunks[2]].join("/");
    var tonextDate = req.query.txt_to;
    var tonextchunks = tonextDate.split('/');
    var tonext_date = [tonextchunks[1], tonextchunks[0], tonextchunks[2]].join("/");
                Claim.find({'createdAt':{ $gte: next_date,$lte:  moment(tonext_date).endOf('day')},
                    $or: [{
                        "claimstatus": "OFFICER_SENDNEW"
                    }, { "claimstatus": "WAREHOUSE_RECEIVED" }, { "claimstatus": "WAREHOUSE_SEND" }, { "claimstatus": "SUPPLIER_RECEIVED" }, { "claimstatus": "SUPPLIER_REPLY" }, { "claimstatus": "warehouse_RECEIVED_SUP" }, { "claimstatus": "warehouse_REPLY" }]
                }).populate('productID').exec(function(err, Claims) {
                    for (var i in Claims) {
                        claim = Claims[i];
                        var claimstatusname = "";
                        switch (claim.claimstatus) {
                            case "OFFICER_SENDNEW":
                                claimstatusname = "ส่งสินค้าไปยังโกดัง";
                                break;
                            case "WAREHOUSE_RECEIVED":
                                claimstatusname = "โกดังรับสินค้า";
                                break;
                            case "WAREHOUSE_SEND":
                                claimstatusname = "โกดังส่งไป SUPPLIER";
                                break;
                            case "SUPPLIER_RECEIVED":
                                claimstatusname = "SUPPLIER รับสินค้า";
                                break;
                            case "SUPPLIER_REPLY":
                                claimstatusname = "ส่งผลเคลม";
                                break;
                            case "warehouse_RECEIVED_SUP":
                                claimstatusname = "โกดังรับสินค้ากลับ";
                                break;
                            case "warehouse_REPLY":
                                claimstatusname = "โกดังส่งสินค้ากลับ";
                                break;
                            case "OFFICER_RECEIVED":
                                claimstatusname = "พนักงานรับสินค้ากลับ";
                                break;
                            case "OFFICER_APPOINTMENT":
                                claimstatusname = "นัดหมายลูกค้ารับสินค้า";
                                break;
                            case "warehouse_CLOSE":
                                claimstatusname = "บัญชี/โกดัง ปิดการเคลม";
                                break;
                            case "FINISH":
                                claimstatusname = "ลูกค้ารับสินค้า";
                                break;
                        }
                        
                        reports.push({
                            id: claim._id,
                            customer_contactname: claim.customer_contactname,
                            customer_contactmobile: claim.customer_contactmobile,
                            product: claim.productID.name,
                            qty: claim.qty,
                            claimdate: claim.claimdate,
                            claimstatus: claim.claimstatus,
                            claimstatusname: claimstatusname,
                            claimbyname: claim.claimbyname,
                            claimbranch:claim.claimbranch
                        });
                    }
                    res.end(JSON.stringify(reports));
                });
        
            }else{
            
                Claim.find({
                    $or: [{
                        "claimstatus": "OFFICER_SENDNEW"
                    }, { "claimstatus": "WAREHOUSE_RECEIVED" }, { "claimstatus": "WAREHOUSE_SEND" }, { "claimstatus": "SUPPLIER_RECEIVED" }, { "claimstatus": "SUPPLIER_REPLY" }, { "claimstatus": "warehouse_RECEIVED_SUP" }, { "claimstatus": "warehouse_REPLY" }]
                }).populate('productID').exec(function(err, Claims) {
                    for (var i in Claims) {
                        claim = Claims[i];
                        var claimstatusname = "";
                        switch (claim.claimstatus) {
                            case "OFFICER_SENDNEW":
                                claimstatusname = "ส่งสินค้าไปยังโกดัง";
                                break;
                            case "WAREHOUSE_RECEIVED":
                                claimstatusname = "โกดังรับสินค้า";
                                break;
                            case "WAREHOUSE_SEND":
                                claimstatusname = "โกดังส่งไป SUPPLIER";
                                break;
                            case "SUPPLIER_RECEIVED":
                                claimstatusname = "SUPPLIER รับสินค้า";
                                break;
                            case "SUPPLIER_REPLY":
                                claimstatusname = "ส่งผลเคลม";
                                break;
                            case "warehouse_RECEIVED_SUP":
                                claimstatusname = "โกดังรับสินค้ากลับ";
                                break;
                            case "warehouse_REPLY":
                                claimstatusname = "โกดังส่งสินค้ากลับ";
                                break;
                            case "OFFICER_RECEIVED":
                                claimstatusname = "พนักงานรับสินค้ากลับ";
                                break;
                            case "OFFICER_APPOINTMENT":
                                claimstatusname = "นัดหมายลูกค้ารับสินค้า";
                                break;
                            case "warehouse_CLOSE":
                                claimstatusname = "บัญชี/โกดัง ปิดการเคลม";
                                break;
                            case "FINISH":
                                claimstatusname = "ลูกค้ารับสินค้า";
                                break;
                        }
                        
                        reports.push({
                            id: claim._id,
                            customer_contactname: claim.customer_contactname,
                            customer_contactmobile: claim.customer_contactmobile,
                            product: claim.productID.name,
                            qty: claim.qty,
                            claimdate: claim.claimdate,
                            claimstatus: claim.claimstatus,
                            claimstatusname: claimstatusname,
                            claimbyname: claim.claimbyname,
                            claimbranch:claim.claimbranch
                        });
                    }
                    res.end(JSON.stringify(reports));
                });
            }
        }
        
    }
});


router.post('/receive', isLoggedIn, function(req, res, next) {
    var now = new Date();
    Claim.findOneAndUpdate({ _id: req.body.claimid }, {
        $set: {
            warehouse_receivedate: now,
            warehouse_receiveqty: req.body.qty,
            warehouse_remark: req.body.remark,
            warehouse_receiveby: req.user._id,
            warehouse_receivebyname: req.user.fullname,
            claimstatus: 'WAREHOUSE_RECEIVED'
        }
    }, { new: true }, function(err, doc) {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        res.end(JSON.stringify("ok"));
    });
});


router.post('/SendSUP', isLoggedIn, function(req, res, next) {
    var now = new Date();
    Claim.findOneAndUpdate({ _id: req.body.claimid }, {
        $set: {
            warehouse_senddate: now,
            warehouse_sendqty: req.body.qty,
            warehouse_sendremark: req.body.remark,
            warehouse_sendby: req.user._id,
            warehouse_sendbyname: req.user.fullname,
            warehouse_sendsupplier: req.body.ddl_sup,
            claimstatus: 'WAREHOUSE_SEND'
        }
    }, { new: true }, function(err, doc) {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        res.end(JSON.stringify("ok"));
    });
});

router.post('/supreceive', isLoggedIn, function(req, res, next) {
    var now = new Date();
    Claim.findOneAndUpdate({ _id: req.body.claimid }, {
        $set: {
            supplier_receivedate: now,
            supplier_receiveqty: req.body.qty,
            supplier_receiveremark: req.body.remark,
            supplier_receiveby: req.user._id,
            supplier_receivebyname: req.user.fullname,
            claimstatus: 'SUPPLIER_RECEIVED'
        }
    }, { new: true }, function(err, doc) {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        res.end(JSON.stringify("ok"));
    });
});


router.post('/supreply', isLoggedIn, function(req, res, next) {
    var now = new Date();
    var IsAccountwork="";
    if (req.body.result=="เคลมเป็น CN")
    {
        IsAccountwork="CN";
    }else if (req.body.result=="เคลมกลับไม่ตรงรุ่น"){
        IsAccountwork="Change Model";
    }
    Claim.findOneAndUpdate({ _id: req.body.claimid }, {
        $set: {
            supplier_replydate: now,
            supplier_replyqty: req.body.qty,
            supplier_resultremark: req.body.remark,
            supplier_replyby: req.user._id,
            supplier_replybyname: req.user.fullname,
            supplier_replyresult: req.body.result,
            IsAccountwork:IsAccountwork,
            claimstatus: 'SUPPLIER_REPLY'
        }
    }, { new: true }, function(err, doc) {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        res.end(JSON.stringify("ok"));
    });
});

router.post('/warehouse_SUP_receive', isLoggedIn, function(req, res, next) {
    var now = new Date();
    Claim.findOneAndUpdate({ _id: req.body.claimid }, {
        $set: {
            warehouse_SUP_receivedate: now,
            warehouse_SUP_receiveqty: req.body.qty,
            warehouse_SUP_remark: req.body.remark,
            warehouse_SUP_receiveby: req.user._id,
            warehouse_SUP_receivebyname: req.user.fullname,
            claimstatus: 'warehouse_RECEIVED_SUP'
        }
    }, { new: true }, function(err, doc) {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        res.end(JSON.stringify("ok"));
    });
});


router.post('/warehouse_REPLY', isLoggedIn, function(req, res, next) {
    var now = new Date();
    //console.log(req.body.claimid + ' ' + req.body.qty + ' ' + req.body.remark);
    Claim.findOneAndUpdate({ _id: req.body.claimid }, {
        $set: {
            warehouse_replydate: now,
            warehouse_replyqty: req.body.qty,
            warehouse_replyremark: req.body.remark,
            warehouse_replyby: req.user._id,
            warehouse_replybyname: req.user.fullname,
            claimstatus: 'warehouse_REPLY'
        }
    }, { new: true }, function(err, doc) {
        if (err) {
            //console.log(err);
            console.log("Something wrong when updating data!");
        }
        res.end(JSON.stringify("ok"));
    });
});

router.post('/warehouse_CLOSE', isLoggedIn, function(req, res, next) {
    var now = new Date();
    //console.log(req.body.claimid + ' ' + req.body.qty + ' ' + req.body.remark);
    Claim.findOneAndUpdate({ _id: req.body.claimid }, {
        $set: {
            warehouse_replydate: now,
            warehouse_replyqty: req.body.qty,
            warehouse_replyremark: req.body.remark,
            warehouse_replyby: req.user._id,
            warehouse_replybyname: req.user.fullname,
            claimstatus: 'warehouse_CLOSE'
        }
    }, { new: true }, function(err, doc) {
        if (err) {
            //console.log(err);
            console.log("Something wrong when updating data!");
        }
        res.end(JSON.stringify("ok"));
    });
});



router.post('/OFFICER_RECEIVED', isLoggedIn, function(req, res, next) {
    var now = new Date();
    Claim.findOneAndUpdate({ _id: req.body.claimid }, {
        $set: {
            claim_receivedate: now,
            claim_receiveqty: req.body.qty,
            claim_receiveremark: req.body.remark,
            claim_receiveby: req.user._id,
            claim_receivebyname: req.user.fullname,
            claimstatus: 'OFFICER_RECEIVED'
        }
    }, { new: true }, function(err, doc) {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        res.end(JSON.stringify("ok"));
    });
});


router.post('/OFFICER_APPOINTMENT', isLoggedIn, function(req, res, next) {
    var now = new Date();
    Claim.findOneAndUpdate({ _id: req.body.claimid }, {
        $set: {
            claim_Appointmentdate: now,
            claim_Appointmentremark: req.body.remark,
            claim_Appointmentby: req.user._id,
            claim_Appointmentbyname: req.user.fullname,
            claimstatus: 'OFFICER_APPOINTMENT'
        }
    }, { new: true }, function(err, doc) {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        res.end(JSON.stringify("ok"));
    });
});


router.post('/FINISH', isLoggedIn, function(req, res, next) {
    var now = new Date();
    Claim.findOneAndUpdate({ _id: req.body.claimid }, {
        $set: {
            customer_receivedclaimdate: now,
            customer_receivedremark: req.body.remark,
            customer_receivedqty: req.body.qty,
            customer_receivedby: req.user._id,
            customer_receivedbyname: req.user.fullname,
            customer_receivedclaim: 1,
            claimstatus: 'FINISH'
        }
    }, { new: true }, function(err, doc) {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        res.end(JSON.stringify("ok"));
    });
});

router.get('/getdataforpopup/:id', isLoggedIn, function(req, res, next) {
    Claim.findById(req.params.id).populate('productID').populate('joblistID').exec(function(err, claims) {
        var reports = [];
        reports.push({
            id: claims._id,
            productname: claims.productID.name,
            producttype: claims.productID.type,
            productproductcode: claims.productID.productcode,
            productbrand: claims.productID.brand,
            productseries: claims.productID.series,
            productsize: claims.productID.size,
            productccode: claims.productID.ccode,
            productremark: claims.productID.remark,
            productID: claims.productID._id,
            yearweek:claims.joblistID.yearweek,
            customer_contactname: claims.customer_contactname,
            customer_contactmobile: claims.customer_contactmobile,
            claimqty: claims.qty,
            claimbyname: claims.claimbyname,
            claimdate: claims.claimdate,
            claimremark: claims.claimremark,
            claimbranch:claims.claimbranch,
            reasonclaim:claims.reasonclaim,
            warehouse_receiveqty: claims.warehouse_receiveqty,
            warehouse_receivebyname: claims.warehouse_receivebyname,
            warehouse_receivedate: claims.warehouse_receivedate,
            warehouse_remark: claims.warehouse_remark,
            warehouse_sendbyname: claims.warehouse_sendbyname,
            warehouse_senddate: claims.warehouse_senddate,
            warehouse_sendremark: claims.warehouse_sendremark,
            warehouse_sendqty: claims.warehouse_sendqty,
            warehouse_sendsupplier: claims.warehouse_sendsupplier,
            supplier_receivedate: claims.supplier_receivedate,
            supplier_receivebyname: claims.supplier_receivebyname,
            supplier_receiveremark: claims.supplier_receiveremark,
            supplier_receiveqty: claims.supplier_receiveqty,

            supplier_replydate: claims.supplier_replydate,
            supplier_replybyname: claims.supplier_replybyname,
            supplier_replyqty: claims.supplier_replyqty,
            supplier_result: claims.supplier_result,
            supplier_resultremark: claims.supplier_resultremark,
            supplier_replyresult: claims.supplier_replyresult,
            IsAccountwork: claims.IsAccountwork,

            warehouse_SUP_receivedate: claims.warehouse_SUP_receivedate,
            warehouse_SUP_receiveby: claims.warehouse_SUP_receiveby,
            warehouse_SUP_receivebyname: claims.warehouse_SUP_receivebyname,
            warehouse_SUP_receiveqty: claims.warehouse_SUP_receiveqty,
            warehouse_SUP_remark: claims.warehouse_SUP_remark,


        });
        res.end(JSON.stringify(reports));
    });
});


router.post('/Get_branch', isLoggedIn, function(req, res, next) {
    Branch.find().lean().distinct('BranchInfo.name').exec((err, branchs) => {
        res.end(JSON.stringify(branchs.sort()));
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}