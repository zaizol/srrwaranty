var mongoose = require('mongoose');

var masterSchema = mongoose.Schema({
    type: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    remark: { type: String, trim: true },
    orders: { type: Number, trim: true },
    online: { type: Number, trim: true },
}, { timestamps: true });

masterSchema.virtual('id').get(function() {
    return this._id.toString();
});

module.exports = mongoose.model('master', masterSchema);