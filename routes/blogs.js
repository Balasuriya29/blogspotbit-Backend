const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const Blog = require('../models/blogmodel');
const ValidateBlog = require('../models/blogmodel');
const AuthUser = require('../models/usermodel');
const adminauth = require('../middleware/adminauth')

//DB POST - API CALL 1
router.post("/add", auth ,async (req,res) => {
    const { error } = ValidateBlog.ValidateBlog(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const blog = new Blog.Blog({
        title: req.body.title,
        author_id: req.body.author_id,
        content: req.body.content,  
        report_reason: req.body.report_reason
    });
    const result = await blog.save();
    res.status(200).send(result);
});

//DB GET ALL - API CALL 2
router.get("/show", auth, async (req,res) =>  {
    const user_reports = await AuthUser.AuthUser.findById(req.user._id).select({reported:1});

    const blogs = await Blog.Blog.find(
        {
            _id : {
                $nin : user_reports.reported
            }
        }
    ).populate('author_id',['name', 'profile_color']);

    res.send(blogs).status(200);
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

//DB MY BLOGS SHOW - API CALL 4
router.get("/showmyblogs/:id", auth, async (req,res) => {
        const blogs = await Blog.Blog.find({
            author_id: req.params.id
        }).populate('author_id', ['name','profile_color'])

        if(!blogs) return res.status(404).send("Please Add a Blog"); // Not Found

        res.status(200).send(blogs)
});

//DB SAVED BLOGS SHOW - API CALL 5
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
            if(user.reported.includes(element)){
                blogs.push("NULL");
                const len = user.saved.length;
                if(len == blogs.length){
                    return res.status(200).send(blogs);
                }
            }
            else{
                const blog = await Blog.Blog.findOne({
                    _id : parseInt(element)

                }).populate('author_id', ['name', 'profile_color'])

                if(blog){
                    blogs.push(blog);
                    const len = user.saved.length;
                    if(len == blogs.length){
                        return res.status(200).send(blogs);
                    }
                }
                else{
                    blogs.push("NULL");
                    const len = user.saved.length;
                    if(len == blogs.length){
                        return res.status(200).send(blogs);
                    }
                }   
            }
        });
    }
});

//DB SAVED BLOGS SHOW - API CALL 6
router.get("/adminshow", adminauth, async (req, res) => {
    const blogs = await Blog
        .Blog
        .find()
        .populate('author_id',['name', 'profile_color']);
    
    if(blogs.length == 0){
        return res.status(404).send("No blogs Found");
    }
  
    res.status(200).send(blogs);
  
  });

//DB SAVED BLOGS SHOW - API CALL 7
router.get("/blog/:id", async (req,res) => {
    const blog = await Blog
        .Blog
        .findById(req.params.id)
        .populate('author_id',['name', 'profile_color']);

    if(!blog) return res.status(400).render('index', {
        title: "This Blog Not Found",
    });
    
    res.status(200).render('index', blog);
});

module.exports = router;
