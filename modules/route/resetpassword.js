var express = require('express')
var router = express.Router()
const path = require('path');
var appDir = path.dirname(require.main.filename);
var mongoose = require(path.join(appDir, '/modules/database/mongoose.js'));


  router.use(function timeLog(req, res, next) {
      //Zbędne?

        next()
    })
    router.route('/')
        .post(function(req, res) {
            
            var email=req.body.Email;
            mongoose.resetpassword(email).then(function(resp){
                res.status(200).send("If your email is in the database new mail with new password sent")
            }).catch(function(err){
                res.status(200).send('If your email is in the database new mail with new password sent');
            })
            
        })
        .get(function(req, res) {
           
                    res.sendFile(appDir + '/templates/reset.html');
          

        })
module.exports = router;