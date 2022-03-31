//Required Packages
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require("joi");

//Defining a blogSchema
const blogSchema = new mongoose.Schema({
    _id: Number,
    title: String,
    author_id: String,
    author_name: String,
    content: String,
    likes: {type: Number, default: parseInt(0)},
    date: {type: Date, default: Date.now},
    url: String,
}, { _id: false });
blogSchema.plugin(AutoIncrement);

//Creating a Model
const Blog = mongoose.model('newblog',blogSchema,'blog');

//Validation 
function validateBlog(blog) {
    const tempschema = Joi.object({
        title: Joi.string().min(5).max(100).required(),
        author: Joi.string().min(5).max(50).required(),
        content: Joi.string().min(5).max(1024).required(), 
    });

    return tempschema.validate(blog);
}

module.exports.Blog = Blog;
module.exports.ValidateBlog = validateBlog;