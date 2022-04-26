const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const router = express.Router();
const AuthUser = require('../models/usermodel');
const ValidateAuthUser = require('../models/usermodel');
const auth = require('../middleware/auth');

//DB POST AuthUSER - API CALL 1
router.post("/add", async (req, res) => { 
    if (!req.params.id) return res.status(403).send("You Cannot access it from here");

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
        isAdmin: req.body.isAdmin,
        url: req.body.url
    });
    
    const token = authuser.generateAuthToken();

    await authuser.save();
    res.status(200).header('x-auth-token', token).send(_.pick(authuser, ['_id', 'name', 'email', 'isAdmin']));
});

//DB GET CURRENT USER - API CALL 2
router.get('/me', auth, async (req, res) => {
    const user = await AuthUser.AuthUser.findById(req.user._id).select('-password');
    res.status(200).send(user);
});

//DB PUT LIKED BLOGS - API CALL 3
router.put('/liked/:id', auth,  async (req, res) => {
        const user = await AuthUser.AuthUser.updateOne(
            {
                _id: req.user._id
            },
            {
                $push: {
                    liked_blogs : req.params.id
                }
            });
            if(!user) return res.status(404).send("No User Found");

        res.status(200).send(user);
});

//DB PUT LIKED BLOGS - API CALL 4
router.put('/rmliked/:id', auth,  async (req, res) => {
        const user = await AuthUser.AuthUser.updateOne(
            {
                _id: req.user._id
            },
            {
                $pull: {
                    liked_blogs : req.params.id
                }
            });
        if(!user) return res.status(404).send("No User Found");
        res.status(200).send(user);
});

//DB DELETE USER BLOGS - API CAll 5
router.get('/delete', auth , async (req, res) => {
    const user = await AuthUser.AuthUser.deleteOne({
       _id : req.user._id
    });

    if(!user) return res.status(404).send("Nothing found");

    res.status(200).send(user);
});

//DB UPDATE SAVED BLOGS ID - API CALL 6
router.put("/saved/:id", auth, async (req, res) => {

        const user = await AuthUser.AuthUser.updateOne(
            {
                _id : req.user._id
            },

            {
                $push: {
                    saved : req.params.id
                }
            }
        )
        if(!user) return res.status(404).send("Nothing found");
        res.status(200).send(user);
});

//DB UPDATE SAVED BLOGS ID - API CALL 7
router.put("/rmsaved/:id", auth, async (req, res) => {
        const user = await AuthUser.AuthUser.updateOne(
            {
                _id : req.user._id
            },

            {
                $pull: {
                    saved : req.params.id
                }
            }
        )
        if(!user) return res.status(404).send("Nothing found");
        res.status(200).send(user);

});

module.exports = router;