//Required Packages
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

//Schema Section
const otpschema = new mongoose.Schema({
    // id: Number,
    otp: {
        type: String,
        required: true
    },
    expiration_time: {
        type: Date,
    },
    verified: {
        type: Boolean, 
        default: false
    }
});


//Creating a Model
const OTP = mongoose.model('newotp',otpschema,'OTP');

module.exports.OTP = OTP;