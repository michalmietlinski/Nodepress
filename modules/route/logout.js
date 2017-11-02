var express = require('express')
var router = express.Router()
const path = require('path');
var appDir = path.dirname(require.main.filename);


  router.use(function timeLog(req, res, next) {
      //Zbędne?

        next()
    })
    router.route('/')
        .post(function(req, res) {

            //Dopisać wylogowanie
            if (req.isAuthenticated()) {
                req.session.destroy(function (err) {
                    res.redirect('/'); //Inside a callback… bulletproof!
                  });
            } else {
                res.status(404).send('Not logged in');
            }
        })
        .get(function(req, res) {
            //wylogowanie i przekierowanie
            if (req.isAuthenticated()) {
                req.session.destroy(function (err) {
                    res.redirect('/'); //Inside a callback… bulletproof!
                  });

            } else {
                res.status(404).send('Not logged in');
                res.redirect("/")
            }

        })
module.exports = router;