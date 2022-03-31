const express = require('express');
const config = require('config');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const router = express.Router();
const AuthUser = require('../models/usermodel');

//DB POST Check method USER - API CALL 1
router.post("/check", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await AuthUser.AuthUser.findOne({email: req.body.email});
    if (!user) return res.status(400).send("Invalid Email or Password");

    const validpassword = await bcrypt.compare(req.body.password, user.password);
    if(!validpassword) return res.status(400).send("Invalid Email or Password");
    
    const token = jwt.sign({_id : user._id, isAdmin : user.isAdmin}, config.get('jwtPrivateKey'));
    res.send(token);
});

//Validation
function validateUser(req) {
    const tempschema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required() 
    });

    return tempschema.validate(req);
}

module.exports = router;