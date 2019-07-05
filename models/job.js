var mongoose = require('mongoose');

var jobSchema = mongoose.Schema({
    customerID: { type: mongoose.Schema.ObjectId, ref: 'Customer' },
    carID: { type: mongoose.Schema.ObjectId, ref: 'Car' },
    branchID: { type: mongoose.Schema.ObjectId, ref: 'Branch' },
    mileage: { type: String, trim: true },
    branchname: { type: String, trim: true },
    salename: { type: String, trim: true },
    
}, { timestamps: true });

jobSchema.virtual('id').get(function() {
    return this._id.toString();
});

module.exports = mongoose.model('Job', jobSchema);