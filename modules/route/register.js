var express = require('express')
var router = express.Router()
const path = require('path');
var appDir = path.dirname(require.main.filename);
var mongoose = require(path.join(appDir, '/modules/database/mongoose.js'));
var email = require(path.join(appDir,'./modules/email/email.js'));
var crypt = require(path.join(appDir,'./modules/crypt/crypt.js'));
var user = require(path.join(appDir, '/modules/database/schemas/user.js'));
var randomstring = require("randomstring");

router.use(function timeLog(req, res, next) {
    //Zbędne?

    next()
})
router.route('/')
    .post(function(req, res, next) {
        //Brakuje obsługi błędu
        var temp2=randomstring.generate();
        var temp = user.user.addUser(req.body.username, req.body.password, req.body.Email, req.body.gender, req.body.address, temp2);
        temp.then(function(response) {


           
            var p=temp2;

            link = "localhost:5000/activate?p=" + p;
            var html = "<a href='" + link + "'>Aktywuj</a>"
            email(html)
            res.redirect("/")
        }).catch(function(response) {
            res.send(response)

        })
    })
    .get(function(req, res) {
        res.sendFile(appDir + '/templates/register.html');
    })
module.exports = router;