 "use strict";
const express = require('express')
const router = express.Router()
const path = require('path');
const appDir = path.dirname(require.main.filename);
const config = require(appDir + '/modules/config/config.js')
const mongoose = require('mongoose');
class Database {
    constructor(parent,mongo) {
        this.parent = parent;
        this.mongo=mongo;
        console.log(this.mongo)
    }

    init() {
        return new Promise(function(resolve, reject) {
            if (mongoose.connection.readyState != 2) {
         
                mongoose.connect(config.db);
                var db = mongoose.connection;
                db.on('error', console.error.bind(console, 'connection error:'));
                db.once('open', function() {
                    // we're connected!
                    console.log("Database connected")
                    resolve("Mongoose connected")
                });
            }else{
             console.log("conn")
             reject("already connected")
            }

        })
    }

}
module.exports=Database