var express = require('express')
var router = express.Router()
const path = require('path');
var appDir = path.dirname(require.main.filename);


  router.use(function timeLog(req, res, next) {
        console.log('Time: ', Date.now())

        next()
    })
    router.route('/')
        .post(function(req, res) {
            if (req.isAuthenticated()) {
                res.status(200).send(req.user);
            } else {
                res.status(404).send('Not logged in');
            }
        })
        .get(function(req, res) {

            if (req.isAuthenticated()) {
                res.send(req.user);
            } else {
                res.redirect("/")
            }

        })
module.exports = router;