const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required:[true,'please provide an email address'],
        unique:[true, 'Email Exist'],
    },
    password: {
        type: String,
        required:[true,'please provide a password'],
        unique:[true, 'Password Exist'],
    },
    roles: [{
        type: String,
        default: 'customer'
    }],
    active: {
        type: Boolean,
        default: true
    },
})

const model = mongoose.model('userModel', UserSchema);

module.exports = model