var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({
    customerInfo: {
        name: { type: String, required: true, trim: true },
        lastname: { type: String, trim: true },
        mobile: { type: String, trim: true },
        facebook: { type: String, trim: true },
        lineID: { type: String, trim: true },
    },
    RegisterInfo: {
        branchID: { type: mongoose.Schema.ObjectId, ref: 'Branch' },
        dateofRegister: { type: 'Date' },
        createby:{type: mongoose.Schema.ObjectId, ref: 'User'},
    },
    ServiceHistoryInfo: {
        Servicedate: { type: 'Date' },
        branchID: { type: mongoose.Schema.ObjectId, ref: 'Branch' },
        carID: { type: mongoose.Schema.ObjectId, ref: 'Car' },
        jobID: { type: mongoose.Schema.ObjectId, ref: 'Job' },
    },
    LastServicedate: { type: 'Date' },
    ActionBy:{type: mongoose.Schema.ObjectId, ref: 'User'},
}, { timestamps: true });
customerSchema.virtual('id').get(function() {
    return this._id.toString();
});
customerSchema.virtual('customerInfo.fullname').get(function() {
    return this.customerInfo.name + ' ' + this.customerInfo.lastname;
});
customerSchema.virtual('customerInfo.fullname').set(function(name) {
    var split = name.split(' ');
    this.customerInfo.name = split[0];
    this.customerInfo.lastname = split[1];
});
module.exports = mongoose.model('Customer', customerSchema);