var mongoose = require('mongoose');
var carbrandSchema = mongoose.Schema({
    brand: { type: String, required: true, trim: true },
    brandthainame: { type: String, trim: true },
}, { timestamps: true });

carbrandSchema.virtual('id').get(function() {
    return this._id.toString();
});

module.exports = mongoose.model('carbrand', carbrandSchema);