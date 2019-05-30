var mongoose = require('mongoose');

var branchSchema = mongoose.Schema({
    BranchInfo: {
        name: { type: String, required: true, trim: true },
        open: { type: String, trim: true },
        close: { type: String, trim: true },
        state: { type: String, trim: true },
    },
    locationInfo: {
        locationName: { type: String, trim: true },
        latitude: { type: String, trim: true },
        longtitude: { type: String, trim: true },
        zoom: { type: String, trim: true },
        addressno: { type: String, trim: true },
        subdistrict: { type: String, trim: true },
        district: { type: String, trim: true },
        province: { type: String, trim: true },
        zipcode: { type: String, trim: true }
    },
    orders: { type: Number },
}, { timestamps: true });

branchSchema.virtual('id').get(function() {
    return this._id.toString();
});

module.exports = mongoose.model('Branch', branchSchema);