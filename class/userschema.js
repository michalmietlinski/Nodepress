  "use strict";
  const mongoose = require('mongoose');
  const path = require('path');
  const appDir = path.dirname(require.main.filename);
  const permissions = require(path.join(appDir, '/modules/permissions/permissions.js'));
  const hbs = require('hbs');
  hbs.registerPartials(appDir + '/templates/hbs/partials');
  const config = require(appDir + '/modules/config/config.js')
  const database = require(appDir + '/class/database.js')
  const randomstring = require("randomstring");
 
 const express = require('express');
const router = express.Router();
  const BaseSchema =
      mongoose.Schema({
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
  BaseSchema.methods.validPassword = function(pwd) {

      return (this.password === pwd);
  };
  const schems = mongoose.model('User', BaseSchema);
  class UserMongoSchema extends database {

      constructor(parent, config) {
          super(parent, config, schems)
          this._user = schems;
          this._base = BaseSchema;
      }
      init() {
          console.log("init userschema")


          this._user.schema.methods.show = function() {
              var temp;
              temp = this.username + "\n" + this.email;
          }

          this.resetpassword = this._resetpassword(this);
          return this._user;
      }
      findemail(email) {
              return new Promise(function(resolve, reject) {
                  schems.find({
                      email: email
                  }, function(err, result) {
                      console.log(result)
                      if (err) reject(err);
                      resolve(result[0]);
                  });
              });
          }
          //Todo!
      _resetpassword(instance) {
          return function(email) {
              return new Promise(function(resolve, reject) {

                  instance.findemail(email).then(function(resp) {
                      if (resp) {
                          instance._user.findById(resp.id, function(err, user) {
                              if (err) reject(err);
                              user.password = randomstring.generate(12);
                              var html = "<html>Your new password is: " + user.password + "</html>"
                              instance._parent._messages.sendMail(html)
                              user.save(function(err, sukces) {
                                  console.log(err)
                                  console.log(sukces)
                                  if (err) reject(err);
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
      }
      _Login(router, app, passport) {

          if (passport) {

              router.use(function timeLog(req, res, next) {
                  console.log('Time of login: ', Date.now())

                  next()
              })
              router.route('/').post(function(req, res) {
                      console.log("")
                      passport.authenticate('locals', {
                          successRedirect: '/',
                          failureRedirect: '/login',
                          failureFlash: false,
                          session: true
                      })
                  })
                  .get(function(req, res) {


                      res.sendFile(appDir + '/templates/login.html');

                  })
              return router 
          }

      }
      _findverifystring(verifystring) {
        const ust=this;
          return new Promise(function(resolve, reject) {
              ust._user.find({
                  verifystring: verifystring
              }, function(err, result) {
                  console.log(result)
                  if (err) reject(err);
                  resolve(result[0]);
              });
          });
      }

      _activate_funct(str) {
          const usr=this;
          return new Promise(function(resolve, reject) {
            // console.log(usr)
              usr._findverifystring(str).then(function(resp) {
                console.log(resp)
                  if (resp) {
                      usr._user.findById(resp.id, function(err, user) {
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

      _activate( usr) {
          router.use(function timeLog(req, res, next) {
              // console.log('Time: ', Date.now())
              next()
          })


          router.route('/')
              .post(function(req, res) {
                  res.send('Hello POST');
              })
              .get(function(req, res) {
                  console.log("activatess")
                  //console.log(req.query.p)
                  // console.log(usr)
                  //res.send("sdffds")

                  var p = req.query.p;
                  //console.log(p);

                  //console.log()
                  usr._activate_funct(p).then(function() {
                      res.send("done");

                  }).catch(function(err) {

                      res.send(err);
                  })


              })

          return router

      }
  }

  module.exports = UserMongoSchema;