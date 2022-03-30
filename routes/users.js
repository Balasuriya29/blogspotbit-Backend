const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const router = express.Router();
const AuthUser = require('../models/usermodel');
const ValidateAuthUser = require('../models/usermodel');

//DB POST AuthUSER - API CALL 1
router.post("/add", async (req, res) => {    
    const { error } = ValidateAuthUser.ValidateAuthUser(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    let authuser = await AuthUser.AuthUser.findOne({email: req.body.email});
    if (authuser) return res.status(404).send("User Already registered");

    const Salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, Salt);

    authuser = await AuthUser.AuthUser({
        name: req.body.name,
        email: req.body.email,
        password: hashed
    });
    
    const token = authuser.generateAuthToken();

    await authuser.save();
    res.header('x-auth-token', token).send(_.pick(authuser, ['_id', 'name', 'email']));
});

module.exports = router;