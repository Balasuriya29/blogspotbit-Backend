//Required Packages
const mongoose = require('mongoose');
const mongoose_morgan = require('mongoose-morgan')
require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const connection = require('./connection');
const config = require('config');


const blogs = require('./routes/blogs');
const users = require('./routes/users');
const auth = require('./routes/auth');
const verify_otp = require('./routes/verifyOTP')
const send_otp_to_email = require('./routes/sendOTP_to_email')

if(!config.get('jwtPrivateKey')){
    console.log(config.get('jwtPrivateKey'))
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

//Connection to MongoDB
const sample = `mongodb+srv://${config.get('DBUserName')}:${config.get('DBPassword')}@cluster0.dfr13.mongodb.net/sample?retryWrites=true&w=majority`;
connection.connectDB(sample, 'sample');

//Setting up cors
var cors = require('cors');
var corsOption = {
  origin: "*",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};

const app = express();
app.use(express.json());
app.use(cors(corsOption));
app.use(helmet())
app.use(mongoose_morgan({
  collection: 'logs',
  connectionString: sample,
 },{},
 'common'
));
app.set('view engine', 'pug');
app.set('views', './views');

app.use('/api/send', send_otp_to_email);
app.use('/api/send', verify_otp);
app.use('/api/blogs', blogs);
app.use('/api/users', users);
app.use('/api/users', auth);

//Default Route
app.get("/", (req,res) => {
    res.status(200).send("Everything is Working Perfectly!!!");
});

const PORT = process.env.PORT || 80;
app.listen(PORT,() => console.log(`Listening at ${PORT}`))
