var express = require('express');
const cors = require('cors');
var indexRouter = require('./routes/index');
const processRouter = require('./routes/process'); 

const errorHandler = (error, request, response, next) => {
    console.log( `error ${error.message}`)
    const status = error.status || 400
    response.status(status).send(error.message) 
}

var app = express();

// Set up mongodb connection
var mongoose = require('mongoose');
mongoose.set('strictQuery', true);
var dev_db_url = 'mongodb://127.0.0.1:27017';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Enable all cors requests
app.use(cors(
    {
        origin: '*'
    }
))

// Enable parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Load route handlers
app.use('/', indexRouter);
app.use('/process', processRouter);

// Load error handler
app.use(errorHandler);

module.exports = app;
