var mongoose = require('mongoose');

var carSchema = mongoose.Schema({
    customerID: { type: mongoose.Schema.ObjectId, ref: 'Customer' },
    carInfo: {
        brand: { type: String, trim: true },
        series: { type: String, trim: true },
        licenseNo: { type: String, trim: true },
        mileage: { type: String, trim: true },
        caryear: { type: String, trim: true },
    },
}, { timestamps: true });

carSchema.virtual('id').get(function() {
    return this._id.toString();
});

carSchema.virtual('customerInfo.fullname').get(function() {
    return this.customerInfo.name + ' ' + this.customerInfo.lastname;
});
carSchema.virtual('customerInfo.fullname').set(function(name) {
    var split = name.split(' ');
    this.customerInfo.name = split[0];
    this.customerInfo.lastname = split[1];
});

module.exports = mongoose.model('Car', carSchema);