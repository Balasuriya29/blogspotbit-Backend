const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const router = express.Router();
const AuthUser = require('../models/usermodel');
const ValidateAuthUser = require('../models/usermodel');
const Blog = require('../models/blogmodel');
const auth = require('../middleware/auth');
const adminauth = require('../middleware/adminauth');

//DB POST AuthUSER - API CALL 1
router.post("/add/:id", async (req, res) => {    
    const { error } = ValidateAuthUser.ValidateAuthUser(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    let authuser = await AuthUser.AuthUser.findOne({email: req.body.email});
    if (authuser) return res.status(404).send("User Already registered");

    const Salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, Salt);

    authuser = await AuthUser.AuthUser({
        name: req.body.name,
        email: req.body.email,
        password: hashed,
        isAdmin: req.body.isAdmin
    });
    
    const token = authuser.generateAuthToken();

    await authuser.save();
    res.header('x-auth-token', token).send(_.pick(authuser, ['_id', 'name', 'email', 'isAdmin']));
});

//DB GET CURRENT USER - API CALL 2
router.get('/me', auth, async (req, res) => {
    const user = await AuthUser.AuthUser.findById(req.user._id).select('-password');
    res.send(user);
});

//DB PUT LIKED BLOGS - API CALL 3
router.put('/liked_blogs/:uemail', async (req, res) => {
    const user = await AuthUser.AuthUser.updateOne(
        {
            email: req.params.uemail
        },
        {
            $push: {
                liked_blogs : req.body._id
            }
        });

   res.send('success');
});

//DB DELETE USER BLOGS - API CAll 4
router.get('/delete', auth , async (req, res) => {
    const user = await AuthUser.AuthUser.deleteOne({
       _id : req.user._id
    });
    res.send(user);
});

module.exports = router;