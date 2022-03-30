//Required Packages
const mongoose = require('mongoose');

//Connection to DB
function connectDB(DB_string) {
    mongoose.connect(DB_string)
    .then(() => console.log('connected to MongoDB'))
    .catch(err => console.error('Could not connect MongoDB', err));
}
    
module.exports.connectDB = connectDB; 