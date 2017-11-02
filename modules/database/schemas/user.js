var express = require('express')
var router = express.Router()
const path = require('path');
var appDir = path.dirname(require.main.filename);
var config = require(appDir + '/modules/config/config.js')
var randomstring = require("randomstring");

// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })
var mongoose = require('mongoose');
var user = {
    schema: mongoose.Schema({
        username: {
            type: String,
            unique: true,
            required: true,
            dropDups: true
        },
        password: {
            type: String,
            unique: false,
            required: true,
            dropDups: false
        },
        email: {
            type: String,
            unique: true,
            required: true,
            dropDups: true
        },
        gender: String,
        address: String,
        checked: Boolean,
        verifystring: String,
        level: Number,
        role: {
            type: String,
            unique: false,
            enum: config.availlableRoles,
            required: true,
            dropDups: false,
            validate: {
                validator: function(v) {
                    console.log(v)
                    return true;
                },
                message: '{VALUE} is not a valid phone number!'
            },
            message: '{VALUE} is not a valid phone number!'
        }

    })
};
user.schema.methods.validPassword = function(pwd) {
    // EXAMPLE CODE!
    return (this.password === pwd);
};
user.schema.methods.show = function() {
    var temp;
    temp = this.username + "\n" + this.email;
}
user.model = mongoose.model('User', user.schema);

// Use connect method to connect to the server


module.exports.user = user.model;


var findverifystring = function(verifystring) {
    return new Promise(function(resolve, reject) {
        user.model.find({
            verifystring: verifystring
        }, function(err, result) {
            console.log(result)
            if (err) reject(err);
             resolve(result[0]);
        });
    });
}
var finduser = function(username) {
    return new Promise(function(resolve, reject) {
        user.model.find({
            username: username
        }, function(err, result) {
            console.log(result)
            if (err) reject(err);
             resolve(result[0]);
        });
    });
}
var findemail = function(email) {
    return new Promise(function(resolve, reject) {
        user.model.find({
            email: email
        }, function(err, result) {
            console.log(result)
            if (err) reject(err);
             resolve(result[0]);
        });
    });
}
var findall = function(req) {


    return new Promise(function(resolve, reject) {
        // if (permissions.byrole(req, config.availlablePermission['Page']['Read'])) {
        user.model.find({}, function(err, result) {
            console.log(err)
            console.log("cokkolwieksiedzieje")
            if (err) reject(err);
            resolve(result);
        });

        //}else{resolve("Permission")}
    });

}

function activate(string) {
    return new Promise(function(resolve, reject) {

        findverifystring(string).then(function(resp) {
            if (resp) {
                user.model.findById(resp.id, function(err, user) {
                    if (err) return handleError(err);
                    if (user.checked) {
                        reject("user already confirmed")
                    } else {
                        user.checked = true;
                        user.save(function(err, sukces) {
                            if (err) return handleError(err);
                            resolve(sukces);
                        });
                    }
                });
            } else {
                reject("user does not exists")
            }
        }).catch(function(response) {
            reject(response)
        });



    });
}

function resetpassword(email) {
    return new Promise(function(resolve, reject) {

        findemail(email).then(function(resp) {
            if (resp) {
                user.model.findById(resp.id, function(err, user) {
                    if (err) return handleError(err);
                    user.password = randomstring.generate(12);
                    var html = "<html>Your new password is: " + user.password + "</html>"
                    sendemail(html)
                    user.save(function(err, sukces) {
                        if (err) return handleError(err);
                        resolve(sukces);
                    });
                });
            } else {
                reject("user does not exists")
            }
        }).catch(function(response) {
            reject(response)
        });
    })
}

function registerUser(username, password, email, gender, address, role, level) {
    var temp2 = randomstring.generate();
    return new Promise(function(resolve, reject) {
        finduser(username).then(function(resp) {
            if (!resp) {
                findemail(email).then(function(resp) {
                    if (!resp) {
                        var temp = new User({
                                "username": username,
                                "password": password,
                                "email": email,
                                "gender": gender,
                                "address": address,
                                "checked": false,
                                "verifystring": temp2,
                                "role": role,
                                "level": level
                            })
                            // we're connected!

                        temp.save(function(err, temp) {
                            if (err) {
                                console.log(err)
                                reject(err);
                            }
                            User.find(function(err, result) {
                                resolve(result[0]);
                            });
                        });
                    } else {
                        reject("user exists")
                    }
                }).catch(function(response) {
                    reject(response)
                });
            } else {
                reject("user exists")
            }
        }).catch(function(response) {
            reject(response)
        });


    });
}

function adduser(username, password, email, gender, address, verifystring, role, level) {
    return new Promise(function(resolve, reject) {
        finduser(username).then(function(resp) {
            if (!resp) {
                findemail(email).then(function(resp) {
                    if (!resp) {
                        var temp = new User({
                                "username": username,
                                "password": password,
                                "email": email,
                                "gender": gender,
                                "address": address,
                                "checked": false,
                                "verifystring": verifystring,
                                "role": role,
                                "level": level
                            })
                            // we're connected!

                        temp.save(function(err, temp) {
                            if (err) {
                                console.log(err)
                                reject(err);
                            }
                            User.find(function(err, result) {
                                resolve(result[0]);
                            });
                        });
                    } else {
                        reject("user exists")
                    }
                }).catch(function(response) {
                    reject(response)
                });
            } else {
                reject("user exists")
            }
        }).catch(function(response) {
            reject(response)
        });


    });
}
module.exports.activate = activate;
module.exports.resetpassword = resetpassword;
module.exports.addUser = adduser;
module.exports.finduser = finduser;
module.exports.findemail = findemail;
module.exports.registerUser = registerUser;
module.exports.findall = findall;