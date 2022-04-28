//Required Packages
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require("joi");
const { AuthUserSchema } = require('./usermodel');

//Defining a blogSchema
const blogSchema = new mongoose.Schema({
    _id: Number,
    title: String,
    author_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'authuser'
    },
    author_name: String,
    content: String,
    likes: {type: Number, default: parseInt(0)},
    date: {type: Date, default: Date.now},
}, { _id: false });
blogSchema.plugin(AutoIncrement);

//Creating a Model
const Blog = mongoose.model('newblog',blogSchema,'blog');

//Validation 
function validateBlog(blog) {
    const tempschema = Joi.object({
        title: Joi.string().min(5).max(100).required(),
        author_id: Joi.string().min(5).max(50).required(),
        content: Joi.string().min(5).max(1024).required(), 
    });

    return tempschema.validate(blog);
}

module.exports.Blog = Blog;
module.exports.ValidateBlog = validateBlog;