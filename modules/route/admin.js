var express = require('express')
var router = express.Router()
const path = require('path');
var appDir = path.dirname(require.main.filename);

var mongoose = require(path.join(appDir, '/modules/database/mongoose.js'));
var page = require(path.join(appDir, '/modules/database/schemas/page.js'));
var user = require(path.join(appDir, '/modules/database/schemas/user.js'));
var permissions = require(path.join(appDir, '/modules/permissions/permissions.js'));

var hbs = require('hbs');
hbs.registerPartials(appDir + '/templates/hbs/partials');


const fs = require('fs');

router.use(function timeLog(req, res, next) {
    if (req.user) {
        res.locals.Userlogged = true;
    } else {
        res.locals.Usernotlogged = true;
    }
    next()
})
router.route('/')
    .post(function(req, res) {
        res.send('Hello POST');
    })
    .get(function(req, res, next) {
        hbs.registerHelper('loggin', function() {
            if (req.user) return req.user.username;
            return false
        });

        res.locals.templates =

            page.findall(req).then(function(resp) {

                res.locals.header = {
                    title: "admin panel",
                    describtion: "fsfdsfdsfd"
                }



                if (resp) {
                    res.locals.pages = resp;
                }
                fs.readdir(path.join(appDir, '/templates/hbs'), (err, data) => {
                    if (err) throw err;
                    res.locals.templates = data;
                    console.log(res.locals.templates)
                    hbs.registerHelper('themes', function(object) {
                        var out = "<select name='theme'>";
                        for (var i = 0; i < res.locals.templates.length; i++) {

                            if (res.locals.templates[i].replace(".hbs", "") == object) {
                                out += "<option selected>" + res.locals.templates[i].replace(".hbs", "") + "</option>";
                            } else {
                                out += "<option>" + res.locals.templates[i].replace(".hbs", "") + "</option>";
                            }
                        }
                        out += '</select>'
                        return out
                    });
                    res.render(appDir + '/templates/hbs/admin.hbs');
                    setTimeout(function() {
                        console.log("admin")
                    }, 5000)
                });


            }).catch(function(err) {
                res.send(err)
            })

    })

router.route("/users").get(function(req,res){
     hbs.registerHelper('loggin', function() {
            if (req.user) return req.user.username;
            return false
        });

        

            user.findall(req).then(function(resp) {

                res.locals.header = {
                    title: "admin users",
                    describtion: "fsfdsfdsfd"
                }
                res.locals.users=resp;
                res.render(appDir + '/templates/hbs/adminuser.hbs');
            }).catch(function(err) {
                
                res.send(err)
            })




})
router.route('/addPage').post(function(req, res) {
    page.add(req, req.body.title, req.body.link, req.body.text, req.body.theme, req.body.level, req.body.type).then(function(resp) {
        res.send("added")
    }).catch(function(err) {
        res.send(err)
    });
})

router.route('/editPage/:pageID').post(function(req, res) {

        page.save(req, req.params.pageID, req.body.title, req.body.link, req.body.text, req.body.theme, req.body.level, req.body.type).then(function(resp) {
            res.send("saved")
        }).catch(function(err) {
            res.send(err)
        });
    })
    .get(function(req, res) {
        var temp = page.findbyID(req,req.params.pageID);
        temp.then(function(resp) {
            if (resp) {
                // console.log("//////////////////////////////")
                // console.log(resp)
                if (!resp.level || permissions.bylevel(req, res, resp.level),permissions.byrole(req,resp.role)) {

                    res.locals.page = [resp];


                    res.render(appDir + '/templates/hbs/editPage.hbs');
                } else {
                    res.redirect("/login")
                        //res.sendFile(appDir + '/templates/'+resp.theme+'.html');

                }
            } else {
                res.send("no such page");
            }



        })
    })

router.route('/remove/:pageID').post(function(req, res) {

    page.remove(req,req.params.pageID).then(function(info) {
        res.send(info)
    }).catch(function(err) {
        res.send(err)
    })

})
router.route('/register').post(function(req, res, next) {
    //Brakuje obsługi błędu

    var temp = user.registerUser(req.body.username, req.body.password, req.body.Email, req.body.gender, req.body.address, req.body.role, req.body.level);
    temp.then(function(response) {
        var p = temp2;

        link = "localhost:5000/activate?p=" + p;
        var html = "<a href='" + link + "'>Aktywuj</a>"
        email(html)
        res.redirect("/")
    }).catch(function(response) {
        res.send(response)

    })
})
router.route('/tram').get(function(req, res) {
    var temp = tram(req, res);
    temp.then(function(resp) {
        res.send(resp)
    }).catch(function(err) {
        res.send(err)
    });
})
router.route('/reset').post(function(req, res) {

    var email = req.body.Email;
    mongoose.resetpassword(email).then(function(resp) {
        res.status(200).send("If your email is in the database new mail with new password sent")
    }).catch(function(err) {
        res.status(200).send('If your email is in the database new mail with new password sent');
    })

})

module.exports = router;