var mongoose = require('mongoose');

var claimSchema = mongoose.Schema({
    joblistID: { type: mongoose.Schema.ObjectId, ref: 'Joblist' },
    customerID: { type: mongoose.Schema.ObjectId, ref: 'customer' },
    productID: { type: mongoose.Schema.ObjectId, ref: 'product' },
    qty: { type: Number },

    customer_contactname: { type: String, trim: true },
    customer_contactmobile: { type: String, trim: true },

    //officer send product to warehouse

    claimbranch: { type: String, trim: true },
    claimdate: { type: Date },
    claimby: { type: String, trim: true },
    claimbyname: { type: String, trim: true },
    claimremark: { type: String, trim: true },
    reasonclaim: { type: String, trim: true },
    //status : OFFICER_SENDNEW

    warehouse_receivedate: { type: Date },
    warehouse_receiveby: { type: String, trim: true },
    warehouse_receiveqty: { type: Number },
    warehouse_receivebyname: { type: String, trim: true },
    warehouse_remark: { type: String, trim: true },
    IssendSMS_warehouse: { type: Number },
    //status : WAREHOUSE_RECEIVED

    warehouse_senddate: { type: Date },
    warehouse_sendby: { type: String, trim: true },
    warehouse_sendqty: { type: Number },
    warehouse_sendbyname: { type: String, trim: true },
    warehouse_sendremark: { type: String, trim: true },
    warehouse_sendsupplier: { type: String, trim: true },
    //status : WAREHOUSE_SEND

    supplier_receivedate: { type: Date },
    supplier_receiveby: { type: String, trim: true },
    supplier_receivebyname: { type: String, trim: true },
    supplier_receiveremark: { type: String, trim: true },
    supplier_receiveqty: { type: Number },
    //status : SUPPLIER_RECEIVED

    supplier_replydate: { type: Date },
    supplier_replyby: { type: String, trim: true },
    supplier_replybyname: { type: String, trim: true },
    supplier_replyqty: { type: Number },
    supplier_resultremark: { type: String, trim: true },
    supplier_replyresult: { type: String, trim: true },
    Issendresult_supplier: { type: Number },
    //status : SUPPLIER_REPLY
    //ในกรณีที่เคลมได้ แต่ไม่ใช่การเคลมปกติ จะไปรูทอื่น
    IsAccountwork: { type: String, trim: true },

    warehouse_SUP_receivedate: { type: Date },
    warehouse_SUP_receiveby: { type: String, trim: true },
    warehouse_SUP_receivebyname: { type: String, trim: true },
    warehouse_SUP_receiveqty: { type: Number },
    warehouse_SUP_remark: { type: String, trim: true },
    IsproductSMS_comeback: { type: Number },
    //status : warehouse_RECEIVED_SUP

    warehouse_replydate: { type: Date },
    warehouse_replyby: { type: String, trim: true },
    warehouse_replybyname: { type: String, trim: true },
    warehouse_replyqty: { type: Number },
    warehouse_replyremark: { type: String, trim: true },
    //status : warehouse_REPLY

    claim_receivedate: { type: Date },
    claim_receiveby: { type: String, trim: true },
    claim_receiveqty: { type: Number },
    claim_receivebyname: { type: String, trim: true },
    claim_receiveremark: { type: String, trim: true },
    //status : OFFICER_RECEIVED

    claim_Appointmentdate: { type: Date },
    claim_Appointmentday: { type: Date },
    claim_Appointmentby: { type: String, trim: true },
    claim_Appointmentbyname: { type: String, trim: true },
    claim_Appointmentremark: { type: String, trim: true },
    IssendresultSMS_customer: { type: Number },
    //status :OFFICER_APPOINTMENT

    customer_receivedclaim: { type: Number },
    customer_receivedqty: { type: Number },
    customer_receivedby: { type: String, trim: true },
    customer_receivedbyname: { type: String, trim: true },
    customer_receivedclaimdate: { type: Date },
    customer_receivedremark: { type: String, trim: true },
    //status :FINISH

    claimstatus: { type: String, trim: true },

}, { timestamps: true });

claimSchema.virtual('id').get(function() {
    return this._id.toString();
});

module.exports = mongoose.model('Claim', claimSchema);