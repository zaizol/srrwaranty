var express = require('express');
var passport = require('passport');
var router = express.Router();
var Customer = require('../models/customer');
var Product = require('../models/products');
var Claim = require('../models/claims');
var moment = require('moment');
var cors = require('cors');
const request = require('request');
var http = require('http');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
    res.render('claimlist.ejs', { title: 's', user: req.user, momemt: moment });
});

router.get('/loaddata', isLoggedIn, function(req, res, next) {
    var reports = [];
    if (req.query.search != "") {
        //Claim.find({ "claimby": req.user._id,
        Product.find({}).exec(function(err, Products) {
        Claim.find({ $or: [{ "customer_contactname": { $regex: req.query.search, $options: 'i' } }, { "customer_contactmobile": { $regex: req.query.search, $options: 'i' } }] }).populate('productID').exec(function(err, Claims) {
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
                var productname="";
                for (var j in Products) {
                    product = Products[j];
                        if (claim.productID.equals(product._id) )
                        {
                            productname=product.name;
                        break;
                        }
                }


                reports.push({
                    id: claim._id,
                    customer_contactname: claim.customer_contactname,
                    customer_contactmobile: claim.customer_contactmobile,
                    product: productname,
                    qty: claim.qty,
                    claimdate: claim.claimdate,
                    claimstatus: claim.claimstatus,
                    claimstatusname: claimstatusname,
                    claimbyname: claim.claimbyname
                });
            }
            res.end(JSON.stringify(reports));
        });
    });
    } else {
        Product.find({}).exec(function(err, Products) {
        Claim.find({}).exec(function(err, Claims) {
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

                var productname="";
                for (var j in Products) {
                    product = Products[j];
                        if (claim.productID.equals(product._id) )
                        {
                            productname=product.name;
                        break;
                        }
                }

                reports.push({
                    id: claim._id,
                    customer_contactname: claim.customer_contactname,
                    customer_contactmobile: claim.customer_contactmobile,
                    product: productname,
                    qty: claim.qty,
                    claimdate: claim.claimdate,
                    claimstatus: claim.claimstatus,
                    claimstatusname: claimstatusname,
                    claimbyname: claim.claimbyname
                });
            }
            res.end(JSON.stringify(reports));
        });
    });
    }
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


            warehouse_replydate: claims.warehouse_replydate,
            warehouse_replyby: claims.warehouse_replyby,
            warehouse_replybyname: claims.warehouse_replybyname,
            warehouse_replyqty: claims.warehouse_replyqty,
            warehouse_replyremark: claims.warehouse_replyremark,


            claim_receivedate: claims.claim_receivedate,
            claim_receiveby: claims.claim_receiveby,
            claim_receiveqty: claims.claim_receiveqty,
            claim_receivebyname: claims.claim_receivebyname,
            claim_receiveremark: claims.claim_receiveremark,


            claim_Appointmentdate: claims.claim_Appointmentdate,
            claim_Appointmentday: claims.claim_Appointmentday,
            claim_Appointmentby: claims.claim_Appointmentby,
            claim_Appointmentbyname: claims.claim_Appointmentbyname,
            claim_Appointmentremark: claims.claim_Appointmentremark,


        });
        res.end(JSON.stringify(reports));
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
            claim_Appointmentday: moment(req.body.appointdate),
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
            customer_receivedclaim: 1,
            customer_receivedclaimdate: now,
            customer_receivedqty: req.body.qty,
            customer_receivedremark: req.body.remark,
            customer_receivedby: req.user._id,
            customer_receivedbyname: req.user.fullname,
            claimstatus: 'FINISH'
        }
    }, { new: true }, function(err, doc) {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        res.end(JSON.stringify("ok"));
    });
});


router.post('/SMS', isLoggedIn, function(req, res, next) {
    var options = {
        host: 'https://www.thaibulksms.com',
        path: '/sms_api.php?username=0880222084&password=509269&msisdn=' + req.body.mobile + '&message=' + req.body.msg + '&sender=NOTICE&force=premium'
    };

    var req = http.get(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));

        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function(chunk) {
            // You can process streamed parts here...
            bodyChunks.push(chunk);
        }).on('end', function() {
            var body = Buffer.concat(bodyChunks);
            console.log('BODY: ' + body);
            // ...and/or process the entire body here.
        })
    });

    req.on('error', function(e) {
        console.log('ERROR: ' + e.message);
    });
    /*var url = 'http://www.thaibulksms.com/sms_api.php?username=0880222084&password=509269&msisdn=' + req.body.mobile + '&message=' + req.body.msg + '&sender=NOTICE&force=premium';
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'JSONP',
        async: true,
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            console.log('sss');
        }
    });*/


    /*request('http://www.thaibulksms.com/sms_api.php?username=0880222084&password=509269&msisdn=' + req.body.mobile + '&message=' + req.body.msg + '&sender=NOTICE&force=premium', { jsonp: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        console.log(body.url);
        console.log(body.explanation);
    });*/
    res.end(JSON.stringify("ok"));
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}