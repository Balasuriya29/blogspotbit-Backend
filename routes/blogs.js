const express = require('express');
const { result, isNaN, isNumber } = require('lodash');
const auth = require('../middleware/auth');
const router = express.Router();
const Blog = require('../models/blogmodel');
const ValidateBlog = require('../models/blogmodel');
const AuthUser = require('../models/usermodel');

//DB POST - API CALL 1
router.post("/add", auth ,async (req,res) => {
    const { error } = ValidateBlog.ValidateBlog(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const blog = new Blog.Blog(
        req.body        
    );
    const result = await blog.save();
    res.status(200).send(result);
});

//DB GET ALL - API CALL 2
router.get("/show", async (req, res) => {
    const blogs = await Blog
        .Blog
        .find()
        .populate('author_id',['name', 'url']);
    
    if(blogs.length == 0){
        return res.status(404).send("No blogs Found");
    }

    res.status(200).send(blogs);

});


//DB DELETE BY ID - API CALL 3
router.get("/delete/:id", auth, async (req, res) => {
        const blog = await Blog.Blog.deleteOne({
            _id : parseInt(req.params.id)
        });
        if(blog){
            res.status(200).send(blog);
        }
        
});

//DB UPDATE LIKE BY ID - API CALL 4
router.put("/like/:id", async (req, res) => {
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
        res.status(200).send('success')
});

//DB UPDATE DISLIKE BY ID - API CALL 5
router.put("/dislike/:id", async (req, res) => {
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
        res.status(200).send('success')
});

//DB MY BLOGS SHOW - API CALL 6
router.get("/showmyblogs/:id", async (req,res) => {
        const blogs = await Blog.Blog.find({
            author_id: req.params.id
        }).populate('author_id', ['name', 'url'])

        if(!blogs) return res.status(404).send("Please Add a Blog"); // Not Found

        res.status(200).send(blogs)
});

//DB SAVED BLOGS SHOW - API CALL 7
router.get("/showsavedblogs", auth, async (req,res) => {
    
    const user = await AuthUser.AuthUser.findById({
        _id : req.user._id
    })

    if(!user) return res.status(404).send("No User Found");
   
    var blogs = []

    if(user.saved.length == 0){
        res.status(404).send("No Saved Blogs")
    }
    else{
        user.saved.forEach(async element => {
            const blog = await Blog.Blog.findOne({
                _id : parseInt(element)
            }).populate('author_id', ['name', 'url'])
            
            if(blog){
                blogs.push(blog);
                console.log(blogs);
                const len = user.saved.length;
                if(len == blogs.length){
                    return res.status(200).send(blogs);

                }
            }
            
        });
    }
});

module.exports = router;