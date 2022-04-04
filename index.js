//Required Packages
const mongoose = require('mongoose');
//require('dotenv').config();
const express = require('express');
// const path = require('path');
// const helmet = require('helmet');
// const logger = require('morgan');
const connection = require('./connection');
const config = require('config');

//
const blogs = require('./routes/blogs');
const users = require('./routes/users');
const auth = require('./routes/auth');
// const verify_otp = require('./routes/verifyOTP')
// const send_otp_to_email = require('./routes/sendOTP_to_email')

if(!config.get('jwtPrivateKey')){
    console.log(config.get('jwtPrivateKey'))
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

// //Setting up cors
// var cors = require('cors');
// var corsOption = {
//   origin: "*",
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   exposedHeaders: ['x-auth-token']
// };

const app = express();
app.use(express.json());
// app.use(cors(corsOption));
// app.use(helmet())
// app.use(logger('common'))

// app.use('/api/v1/', send_otp_to_phone);
// app.use('/api/v1/', send_otp_to_email);
// app.use('/api/v1', verify_otp);
app.use('/api/blogs', blogs);
app.use('/api/users', users);
app.use('/api/users', auth);

//Connection to MongoDB
const db_string = 'mongodb+srv://arunkarthickm:Arun%40007@cluster0.dfr13.mongodb.net/sample?retryWrites=true&w=majority';
connection.connectDB(db_string);

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => console.log(`Listening at ${PORT}`))
