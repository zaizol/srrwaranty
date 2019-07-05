var express = require('express');
var passport = require('passport');
var router = express.Router();
var Customer = require('../models/customer');
var Product = require('../models/products');
var Claim = require('../models/claims');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('claimstep.ejs', { title: 's', user: req.user, momemt: moment, claimid: null });
});

router.get('/:id', function(req, res, next) {
    res.render('claimstep.ejs', { title: 's', user: req.user, momemt: moment, claimid: req.params.id });
});

router.get('/getdataforpopup/:id', function(req, res, next) {
    Claim.findById(req.params.id).populate('productID').exec(function(err, claims) {
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
            customer_contactname: claims.customer_contactname,
            customer_contactmobile: claims.customer_contactmobile,
            claimqty: claims.qty,
            claimbyname: claims.claimbyname,
            claimdate: claims.claimdate,
            claimremark: claims.claimremark,
            claimbranch:claims.claimbranch,
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

            claimstatus: claims.claimstatus,
            reasonclaim:claims.reasonclaim,
        });
        res.end(JSON.stringify(reports));
    });
});



module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}