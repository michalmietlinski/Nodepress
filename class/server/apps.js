 "use strict";
 const express = require('express');
 const path = require('path');
 const appDir = path.dirname(require.main.filename);
 const bodyParser = require('body-parser');

 const router = express.Router()
 const hbs = require('hbs');
 class server {

     constructor(parent) {
         this.parent = parent;
         this._app = express();
         this._pass = require(appDir + '/class/passport.js')
     }

     init() {
         console.log("init server")
        const handler = this.parent._Services._pages;
         // this.parent._Services._user._Localstrategy(passport)
        const app = this._app;
        const usr = this.parent._Services._user;
        const admin= this.parent._Services._admin;
        var pass = this._pass;
        const objectinstance=this;

         //Test
         // passport.serializeUser(function(username, done) {
         //     done(null, username._id);
         // });
         // passport.deserializeUser(function(id, done) {
         //     usr.findById(id, function(err, username) {
         //         done(err, username);
         //     });
         // });


         return new Promise(function(resolve, reject) {
            


            
             pass.init(app, usr)
             
            app.use(bodyParser());
            app.set('view engine', 'hbs');
            app.set('views', './templates/hbs');
            app.use(express.static(path.join(appDir, '/public')));
            // app.use('/auth', usr._Login(router, app, pass.passport))
            app.post('/auth',pass.passport.authenticate('local', {
                      successRedirect: '/admin',
                      failureRedirect: '/login',
                      failureFlash: false,
                      session: true
                  })
              )
             app.use('/activate',usr._activate(usr)) 
            app.use('/admin',admin.route(router))
            app.use('/users',admin.users(router))
            app.use('/logout',handler.logout)
             app.use("*", handler.handle)

             app.set('port', (process.env.PORT || 5000));
             app.listen(app.get('port'), function() {
                 console.log('Node app is running on port', app.get('port'));
                 resolve(app)
             });

         })
     }


 }

 module.exports = server;
