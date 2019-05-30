var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
    type: { type: String, required: true, trim: true },
    productcode: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    series: { type: String, trim: true },
    size: { type: String, trim: true },
    ccode: { type: String, trim: true },
    remark: { type: String, trim: true },
    orders: { type: Number, trim: true },
    warantyday: { type: Number, trim: true },
    warantymonth: { type: Number, trim: true },
    warantyyear: { type: Number, trim: true },
    warantyconditions: { type: String, trim: true },
    warantyconditionsselect: { type: String, trim: true },
    online: { type: Number, trim: true },
    claims: [{ type: mongoose.Schema.ObjectId, ref: 'Claim' }],
}, { timestamps: true });

productSchema.virtual('id').get(function() {
    return this._id.toString();
});

module.exports = mongoose.model('product', productSchema);