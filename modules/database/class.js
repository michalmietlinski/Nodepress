var express = require('express')
var router = express.Router()
var mongoose = require('mongoose');
const path = require('path');
var appDir = path.dirname(require.main.filename);
var config = require(appDir + '/modules/config/config.js')
var permissions = require(path.join(appDir, '/modules/permissions/permissions.js'));
// var page = require(path.join(appDir, '/modules/database/schemas/page.js'));


class dbClass {
    constructor(parent) {
        this.parent = parent;
        console.log(this.parent)
    }

    init() {
        return Promise.resolve();
    }

    get config() {
        this._config || this.parent.config
    }
}

class Controller extends dbClass {

    constructor(config, owner) {
        super(owner);
        this._config = config;

        this.services = new Services(this);
        // this.app = new App(this);
    }

    init() {
        return Promise.all([
            this.services.init(),
            // this.app.init(),
            super.init()
        ]);
    }

    static getInstance() {
        return new Controller();
    }

}
class Services extends dbClass {

    init() {
        this.mongo = () => {
          console.log(mongoose.connection.readyState)

            if (mongoose.connection.readyState >=1) {
                mongoose.connect('mongodb://localhost:27017/heroku');
                var db = mongoose.connection;
                db.on('error', console.error.bind(console, 'connection error:'));
                db.once('open', function() {
                    // we're connected!
                    console.log("Mongoose connected")
                });
            }
        }

        this.pages = new PagesMongoSchema(page.model, this.mongo);


        return Promise.all([
            this.mongo(),
            super.init()
        ]);
    }

}

class PagesMongoSchema {
    constructor(schema, mongo) {
        this.schema = schema;
        this.mongo = mongo;
        this.config = config;
    }
    find(req, pages) {
        return new Promise(function(resolve, reject) {
            if (permissions.byrole(req, config.availlablePermission['Page']['Read'])) {
                page.model.find({
                    link: pages
                }, function(err, result) {
                    console.log(result)
                    if (err) reject(err);
                    resolve(result[0]);
                });
            } else {
                resolve("Permission")
            }
        });
    }
    findall(req) {
        return new Promise(function(resolve, reject) {
            if (permissions.byrole(req, this.config.availlablePermission['Page']['Read'])) {
                page.model.find({}, function(err, result) {
                    if (err) reject(err);
                    resolve(result);
                });

            } else {
                resolve("Permission")
            }
        });
    }

}
// class PagesMongoSchema {
//     constructor(mongo) {
//         super(schema, mongo);
//     }

//     findOne() {
//         super.findOne();
//     }
// }


module.exports = Controller;