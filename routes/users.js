const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const router = express.Router();
const AuthUser = require('../models/usermodel');
const ValidateAuthUser = require('../models/usermodel');
const Blog = require('../models/blogmodel')
const auth = require('../middleware/auth');
const config = require('config');

//DB POST AuthUSER - API CALL 1
router.post('/add', async (req, res) => { 
    if (!req.header('Secret_Key')) return res.status(403).send("You Cannot access it from here");

    if (!(parseInt(req.header('Secret_Key')) === parseInt(config.get('Secret_Key')))) return res.status(403).send("You Cannot access it from here");

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
        profile_color: req.body.profile_color
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
        await Blog.Blog.updateOne(
            {
                _id:req.params.id
            }
            ,
            {
                $inc: {
                    likes: 1
                }
            });
        
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

        res.status(200).send('success');
});

//DB PUT LIKED BLOGS - API CALL 4
router.put('/rmliked/:id', auth,  async (req, res) => {
    await Blog.Blog.updateOne(
        {
            _id:req.params.id
        }
        ,
        {
            $inc: {
                likes: -1
            }
        });
    
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
        res.status(200).send('success');
});

//DB DELETE USER BLOGS - API CAll 5
router.get('/delete', auth , async (req, res) => {
    await AuthUser.AuthUser.deleteOne({
       _id : req.user._id
    });



    res.status(200).send(user);
});

//DB UPDATE SAVED BLOGS ID - API CALL 6
router.put("/saved/:id", auth, async (req, res) => {

        await AuthUser.AuthUser.updateOne(
            {
                _id : req.user._id
            },

            {
                $push: {
                    saved : req.params.id
                }
            }
        )

        res.status(200).send(user);
});

//DB UPDATE SAVED BLOGS ID - API CALL 7
router.put("/rmsaved/:id", auth, async (req, res) => {
        await AuthUser.AuthUser.updateOne(
            {
                _id : req.user._id
            },

            {
                $pull: {
                    saved : req.params.id
                }
            }
        )

        res.status(200).send(user);

});

//DB UPDATE REPORT BY ID - API CALL 8
router.put("/report/:id", auth, async (req, res) => {
    await Blog.Blog.updateOne(
        {
            _id:req.params.id
        },
        {
            $inc:{
                report: 1,
                "report_reason.Abusive" : req.body.report_reason.Abusive,
                "report_reason.Irrelavent" : req.body.report_reason.Irrelavent,
                "report_reason.Spam or Suspicious" : req.body.report_reason.Spam,
            },
        });

        const blog = await Blog.Blog.findById(req.params.id);

        if(blog.report >= 5){
            const reported_blog = await Blog.reportBlog({
                title: blog.title,
                author_id: blog.author_id,
                content: blog.content,
                likes: blog.likes,
                report : blog.report,
                report_reason: blog.report_reason,
            });

            await reported_blog.save();

            await Blog.Blog.deleteOne({
                _id: parseInt(req.params.id)
            });
        }
        await AuthUser.AuthUser.updateOne(
            {
                _id: req.user._id
            },
            {
                $push: {
                    reported : req.params.id
                },  
            });
        
    res.status(200).send('success');
});



module.exports = router;