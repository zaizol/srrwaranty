var mongoose = require('mongoose');

var wheelSchema = mongoose.Schema({
    brand: { type: String, required: true, trim: true },
    series: { type: String, required: true, trim: true },
    PCD: { type: String, trim: true },
    OFFSET: { type: String, trim: true },
    size: { type: String, trim: true },
    orders: { type: Number, trim: true },
    online: { type: Number, trim: true },
    remark: { type: String, trim: true },
}, { timestamps: true });

wheelSchema.virtual('id').get(function() {
    return this._id.toString();
});

module.exports = mongoose.model('Wheels', wheelSchema);