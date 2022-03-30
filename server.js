//Required Packages
const mongoose = require('mongoose');
const express = require('express');
const connection = require('./connection');
const config = require('config');
const blogs = require('./routes/blogs');
const users = require('./routes/users');
const auth = require('./routes/auth');

if(!config.get('jwtPrivateKey')){
    console.log(config.get('jwtPrivateKey'))
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}
const app = express();
app.use(express.json());
app.use('/api/blogs', blogs);
app.use('/api/users', users);
app.use('/api/users', auth);

//Connection to MongoDB
const db_string = `mongodb+srv://${config.get('DBUserName')}:${config.get('DBPassword')}@cluster0.dfr13.mongodb.net/sample?retryWrites=true&w=majority`;
connection.connectDB(db_string);

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => console.log(`Listening at ${PORT}`))
