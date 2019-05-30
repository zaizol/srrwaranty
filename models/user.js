var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local: {
        username: { type: String, trim: true },
        password: { type: String, trim: true },
        name: { type: String, trim: true },
        surname: { type: String, trim: true },
        email: { type: String },
        mobile: { type: String },
        role: { type: String },
        branch: { type: mongoose.Schema.ObjectId, ref: 'Branch' },
    },
    online: { type: 'Number' },
    offlineon: { type: 'Date' },
}, { timestamps: true });

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.virtual('id').get(function() {
    return this._id.toString();
});

userSchema.virtual('fullname').get(function() {
    return this.local.name.toString() + ' ' + this.local.surname.toString();
});

userSchema.virtual('local.rolename').get(function() {
    switch (this.local.role) {
        case "1":
            return "พนักงานขาย";
            break;
        case "2":
            return "หัวหน้าทีม";
            break;
        case "3":
            return "ผู้จัดการ";
            break;
        case "4":
            return "ผู้จัดการทั่วไป";
            break;
        case "5":
            return "เจ้าของหรือแอดมิน";
            break;
        default:
            return "พนักงานขาย";
            break;
    }
});

module.exports = mongoose.model('User', userSchema);