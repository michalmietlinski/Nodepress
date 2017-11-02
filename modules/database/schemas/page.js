var express = require('express')
var router = express.Router()
var mongoose = require('mongoose');
const path = require('path');
var appDir = path.dirname(require.main.filename);
var config = require(appDir + '/modules/config/config.js')
var permissions = require(path.join(appDir, '/modules/permissions/permissions.js'));
var page = {
    schema: mongoose.Schema({
        link: {
            type: String,
            unique: true,
            required: true,
            dropDups: true
        },
        text: String,
        title: {
            type: String,
            unique: false,
            required: true,
            dropDups: false
        },
        theme: String,
        author: String,
        level: Number,
        author: String,
        role: String,
        type: {
            type: String,
            unique: false,
            enum: config.availlablePageTypes,
            required: true,
            dropDups: false

        }

    })
};

page.schema.methods.matchlink = function(link) {
    return (this.link === link);
};

page.model = mongoose.model('Page', page.schema);


//Methods
var add = function(req, title, link, text, theme, level, type) {
    
        return new Promise(function(resolve, reject) {
            if (permissions.byrole(req, config.availlablePermission['Page']['Add'])) {
            if (req.user) {
                var temp = new page.model({
                    "title": title,
                    "link": link,
                    "text": text,
                    "theme": theme,
                    "author": req.user.username,
                    "type": type
                })
                if (level) temp.level = level;
                // we're connected!

                temp.save(function(err, temp) {
                    if (err) return console.error(err);
                    page.model.find(function(err, result) {
                        console.log(result)
                    });
                    resolve(true)
                })
            } else {
                reject("not logged")
            }
        }else{
            reject("Permission!")
        }
        });
    
}

var save = function(req, id, title, link, text, theme, level, type) {
    return new Promise(function(resolve, reject) {
        if (permissions.byrole(req, config.availlablePermission['Page']['Write'])) {
        if (req.user) {
            // id=mongoose.Types.ObjectId(id);
            console.log(id)
            var query = {
                '_id': id
            };
            page.model.findOneAndUpdate(query, {
                "title": title,
                "link": link,
                "text": text,
                "theme": theme,
                "level": level,
                "type": type
            }, {
                upsert: false
            }, function(err, doc) {
                console.log("cokolwiek")
                if (err) reject(err);
                resolve("succesfully saved");
            });
        } else {
            reject("not logged")
        }
        }else{resolve("Permission")}
    });

}


var find = function(req,pages) {
    return new Promise(function(resolve, reject) {
        if (permissions.byrole(req, config.availlablePermission['Page']['Read'])) {
        page.model.find({
            link: pages
        }, function(err, result) {
            console.log(result)
            if (err) reject(err);
             resolve(result[0]);
        });
        }else{resolve("Permission")}
    });
}


var findbyID = function(req,ID) {
    return new Promise(function(resolve, reject) {
        if (permissions.byrole(req, config.availlablePermission['Page']['Read'])) {
        page.model.find({
            _id: ID
        }, function(err, result) {
            console.log(result)
            if (err) reject(err);
             resolve(result[0]);
        });
        }else{resolve("Permission")}
    });
}
var findall = function(req) {


    return new Promise(function(resolve, reject) {
        if (permissions.byrole(req, config.availlablePermission['Page']['Read'])) {
        page.model.find({}, function(err, result) {
            if (err) reject(err);
             resolve(result);
        });

       }else{resolve("Permission")}
    });

}
var remove = function(req, ID) {
    
        return new Promise(function(resolve, reject) {
            if (permissions.byrole(req, config.availlablePermission['Page']['Remove'])) {
            page.model.find({
                _id: ID
            }).remove(
                function(err, pages) {
                    if (err) reject(err);
                    page.model.findById(ID, function(err, pages) {
                        console.log("pages--" + pages) // null
                        if (!pages) {
                            resolve("Done")
                        }
                    })

                }).exec();
             }else{resolve("Permission")}
        });
   
}
module.exports.model = page.model;
module.exports.save = save;
module.exports.find = find;
module.exports.add = add;
module.exports.findbyID = findbyID;
module.exports.findall = findall;
module.exports.remove = remove;