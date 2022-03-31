const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const Blog = require('../models/blogmodel');
const ValidateBlog = require('../models/blogmodel');

//DB POST - API CALL 1
router.post("/add", auth ,async (req,res) => {
    const { error } = ValidateBlog.ValidateBlog(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const blog = new Blog.Blog(
        req.body        
    );
    const result = await blog.save();
    res.send(result);
});

//DB GET ALL - API CALL 2
router.get("/show", async (req, res) => {
    const blogs = await Blog.Blog.find();
    res.send(blogs);
});

//DB DELETE BY ID - API CALL 3
router.get("/delete/:id", auth, async (req, res) => {
    const blog = await Blog.Blog.deleteOne({
        _id : parseInt(req.params.id)
    });
    res.send(blog);
});

//DB UPDATE LIKE BY ID - API CALL 4
router.put("/like/:id", async (req, res) => {
    const blog = await Blog.Blog.updateOne(
        {
            _id:req.params.id
        }
        ,
        {
            $inc: {
                likes: 1
            }
        });
    res.send('sucess')
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
    res.send('sucess')
});

//DB MY BLOGS SHOW - API CALL 6
router.get("/showmyblogs", async (req,res) => {
    
});
module.exports = router;