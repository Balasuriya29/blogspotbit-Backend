//Required Packages
const mongoose = require('mongoose');
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require('config');
//Schema Section
const AuthUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    saved: [ Number ],
    isAdmin: {type: Boolean, default: false},
    liked_blogs: [ Number ],

});

//Method for Token Generation
AuthUserSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id : this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

//Model Section
const AuthUser = mongoose.model('authuser',AuthUserSchema,'AuthUser');

//Validation 
function validateAuthUser(authuser) {
    const tempschema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean(),

    });

    return tempschema.validate(authuser);
}


module.exports.AuthUser = AuthUser;
module.exports.AuthUserSchema = AuthUserSchema;
module.exports.ValidateAuthUser = validateAuthUser;