var express = require('express')
var router = express.Router()
const path = require('path');
var appDir = path.dirname(require.main.filename);


//Schemas:
// var User = require(path.join(appDir, '/modules/database/schemas/user.js'));
var pagemethods = require(path.join(appDir, '/modules/database/schemas/page.js'));
page=pagemethods.model;
var mongoose = require('mongoose');
var randomstring = require("randomstring");
var sendemail = require(path.join(appDir, './modules/email/email.js'));

function mongos(req, res) {
    if (mongoose.connection.readyState != 2) {
        mongoose.connect('mongodb://localhost:27017/heroku');
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            // we're connected!
            console.log("Mongoose connected")
        });
    }
}
function monger(req, res) {
    
        mongoose.connect('mongodb://localhost:27017/heroku2');
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            // we're connected!
            console.log("Mongoose connected")
        });
    
}

function findelement(shema, value, compare) {
    var tempshema = require(path.join(appDir, '/modules/database/schemas/' + schema + '.js'));
    if (!tempshema) {
        return false;
    } else {
        return new Promise(function(resolve, reject) {
            var tempquery = {};
            tempquery[value] = compare;
            tempshema.find(tempquery, function(err, result) {
                console.log(result)
                if (err) reject(err);
                else resolve(result[0]);
            });


        });
    }
}

function findall(schema) {
    var tempshema = require(path.join(appDir, '/modules/database/schemas/' + schema + '.js'));

    if (!tempshema) {
        return false;
    } else {
        return new Promise(function(resolve, reject) {

            tempshema.find({}, function(err, result) {
                if (err) reject(err);
                else resolve(result);
            });


        });
    }
}



    // Use connect method to connect to the server


module.exports.init = mongos;
module.exports.init2 = monger;
module.exports.testing = mongos;

module.exports.findelement = findelement;


module.exports.findall = findall;

