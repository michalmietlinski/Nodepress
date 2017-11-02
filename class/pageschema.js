  "use strict";
  const mongoose = require('mongoose');
  const path = require('path');
  const appDir = path.dirname(require.main.filename);
  const permissions = require(path.join(appDir, '/modules/permissions/permissions.js'));
  const hbs = require('hbs');
  hbs.registerPartials(appDir + '/templates/hbs/partials');
  const config = require(appDir + '/modules/config/config.js')
  const database = require(appDir + '/class/database.js')
  const singleHandler = require(appDir + '/class/singlehandler.js')

  const schems = mongoose.model('Page',
      mongoose.Schema({
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
  );
  class PagesMongoSchema extends database {
      constructor(parent, config) {
          super(parent, config, schems)
          this._page = schems
          this._handlers = new WeakMap();
          this.indexofpages = {}
          this._page.schema.methods.matchlink = function(link) {
              return (this.link === link);
          };


      }
      init() {
          console.log("init pageschema")

          this.handle = this.handle_funct(this);

          this.find = this.find_funct(this._config)
          this.addone = this.addone_funct(this._config)
          this.save = this.save_funct(this._config)
          this.cache = this.cache_funct(this);

          return this._page;

      }
      clear_all_cache() {
          this.indexofpages = {}
      }

      clear_cache(url) {
          delete instance.indexofpages[url]
      }

      cache_funct(instance) {
          instance.indexofpages = {};
          instance._handlers = new WeakMap();
          var temp = instance.findall();
          temp.then(function(resp) {
              for (var i = 0; i < resp.length; i++) {
                  instance.indexofpages[resp[i].link] = new singleHandler(instance, instance.config, resp[i])
                  instance._handlers.set(instance.indexofpages[resp[i].link], instance.indexofpages[resp[i].link]);
              }
          }).catch(function(err) {
              console.log(err)
          })

      }

      handle_funct(instance) {
          return function(req, res, next) {
              if (instance._handlers.has(instance.indexofpages[req.originalUrl])) {
                  console.log("exists")
                  instance._handlers.get(instance.indexofpages[req.originalUrl]).getpage(req, res, next);
              } else {
                  console.log("doesn't exists")
                  var temp = instance.find(req, req.originalUrl);
                  temp.then(function(resp) {
                      if (resp) {
                          instance.indexofpages[req.originalUrl] = new singleHandler(instance, instance.config, resp)
                          instance._handlers.set(instance.indexofpages[req.originalUrl], instance.indexofpages[req.originalUrl]);
                          instance._handlers.get(instance.indexofpages[req.originalUrl]).getpage(req, res, next);
                      } else {
                          next();
                      }
                  }).catch(function(err) {
                      console.log(err)
                      res.send("nope")
                  })

              }


          }
      }
      find_funct(config) {
          return function(req, pages, schema) {
              return new Promise(function(resolve, reject) {
                  if (permissions.byrole(req, config.availlablePermission['Page']['Read'])) {
                      schems.find({
                          link: pages
                      }, function(err, result) {

                          if (err) reject(err);
                          resolve(result[0]);
                      });
                  } else {
                      resolve("Permission")
                  }
              });
          }
      }
      addone_funct(config) {
          return function(req, title, link, text, theme, level, type) {

              return new Promise(function(resolve, reject) {
                  if (permissions.byrole(req, config.availlablePermission['Page']['Add'])) {
                      if (req.user) {

                          var temp = new schems({
                              "title": title,
                              "link": link,
                              "text": text,
                              "theme": theme,
                              "author": req.user.username,
                              "type": type
                          })
                          console.log(temp)
                          if (level) temp.level = level;
                          // we're connected!
                          temp.save(function(err, temp) {
                              console.log(err + "     " + temp)
                              if (err) reject(err);
                              schems.find(function(err, result) {
                                  console.log(result)
                              });
                              resolve(true)
                          })
                      } else {
                          reject("not logged")
                      }
                  } else {
                      reject("Permission!")
                  }
              });
          }
      }
      save_funct(config) {
          return function(req, id, title, link, text, theme, level, type) {
              return new Promise(function(resolve, reject) {
                  if (permissions.byrole(req, config.availlablePermission['Page']['Write'])) {
                      if (req.user) {
                          // id=mongoose.Types.ObjectId(id);
                          console.log(id)
                          var query = {
                              '_id': id
                          };
                          schems.findOneAndUpdate(query, {
                              "title": title,
                              "link": link,
                              "text": text,
                              "theme": theme,
                              "level": level,
                              "type": type
                          }, {
                              upsert: false
                          }, function(err, doc) {
                              if (err) reject(err);
                              resolve(doc);
                          });
                      } else {
                          reject("not logged")
                      }
                  } else {
                      resolve("Permission")
                  }
              });

          }
      }
      logout(req,res,next) {
          
                  if (req.isAuthenticated()) {
                      req.session.destroy(function(err) {
                          res.redirect('/'); //Inside a callback… bulletproof!
                      });

                  } else {
                      res.status(404).send('Not logged in');
                      res.redirect("/")
                  }

           
      }



  }

  module.exports = PagesMongoSchema;