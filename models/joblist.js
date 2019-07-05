var mongoose = require('mongoose');

var joblistSchema = mongoose.Schema({
    jobID: { type: mongoose.Schema.ObjectId, ref: 'Job' },
    productID: { type: mongoose.Schema.ObjectId, ref: 'product' },
    qty: { type: Number },
    sow: { type: Date },
    eow: { type: Date },
    yearweek: { type: String, trim: true },
    warantyconditions: { type: String, trim: true },
    warantyconditionsselect: { type: String, trim: true },
    isclaim: { type: Number },
    claimstatus: { type: String, trim: true },

    customername: { type: String, trim: true },
    customercontact: { type: String, trim: true },
    customercar: { type: String, trim: true },
    branchname: { type: String, trim: true },
    salename: { type: String, trim: true },

}, { timestamps: true });

joblistSchema.virtual('id').get(function() {
    return this._id.toString();
});

module.exports = mongoose.model('Joblist', joblistSchema);