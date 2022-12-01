#! /usr/bin/env node

console.log('This script populates some test landlords and processes to the database. Specified database as argument');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

var async = require('async')
var Landlord = require('./models/landlord')
var Process = require('./models/process')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var landlords = []
var processes = []

function landlordCreate(identifier,cb) {
  var landlord = new Landlord({identifier});
  
  landlord.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New landlord: ' + landlord);
    landlords.push(landlord)
    cb(null, landlord)
  }  );
}

function processCreate(question,state,applicant_address,cb) {
    
  var process = new Process({question,state,applicant_address}); 

  process.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New process: ' + process);
    processes.push(process)
    cb(null, process)
  }  );
}

function createLandlords(cb) {
    async.series([
        function(callback) {
          landlordCreate('Patrick', callback);
        },
        function(callback) {
          landlordCreate('Ben', callback);
        },
        function(callback) {
          landlordCreate('Isaac', callback);
        },
        ],
        // optional callback
        cb);
}


function createProcesses(cb) {
    async.parallel([
        function(callback) {
          processCreate("Can she afford the rent of 500",1, "0xe52c8d10191Ce98ED9a3c5A529C0E692674102A0", callback);
        },
        function(callback) {
          processCreate("Can she afford the rent of 1000",1, "0xe52c8d10191Ce98ED9a3c5A529C0E692674102A0", callback);
        },
        function(callback) {
          processCreate("Can she afford the rent of 1500",1, "0xe52c8d10191Ce98ED9a3c5A529C0E692674102A0", callback);
        },
        ],
        // optional callback
        cb);
}

async.series([
    createProcesses,
    createLandlords,
    //createProcesses,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('NO ERROR');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});

