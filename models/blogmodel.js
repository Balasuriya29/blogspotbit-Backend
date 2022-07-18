//Required Packages
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require("joi");

//Defining a blogSchema
const blogSchema = new mongoose.Schema({
    _id: Number,
    title: String,
    author_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'authuser'
    },
    content: String,
    likes: {type: Number, default: parseInt(0)},
    date: {type: Date, default: Date.now},
    report : {type: Number, default: parseInt(0)},
    report_reason : {
        type:Map,
        of: {type: Number, default: parseInt(0)},
    }
}, { _id: false });
blogSchema.plugin(AutoIncrement);

//Creating a Model
const Blog = mongoose.model('newblog',blogSchema,'blog');

//Reported Collection
//Defining a blogSchema
const reportblogSchema = new mongoose.Schema({
    title: String,
    author_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'authuser'
    },
    content: String,
    likes: {type: Number},
    date: {type: Date, default: Date.now},
    report : {type: Number},
    report_reason : {
        type:Map,
        of: Number, 
    }
});

//Creating a Model
const reportBlog = mongoose.model('newreportedblog',reportblogSchema,'reported blogs');

//Validation 
function validateBlog(blog) {
    const tempschema = Joi.object({
        title: Joi.string().min(5).max(100).required(),
        author_id: Joi.string().min(5).max(50).required(),
        content: Joi.string().min(5).max(1500).required(), 

    });

    return tempschema.validate(blog);
}

module.exports.Blog = Blog;
module.exports.reportBlog = reportBlog;
module.exports.ValidateBlog = validateBlog;