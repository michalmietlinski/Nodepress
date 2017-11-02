  "use strict";
  const path = require('path');
  const appDir = path.dirname(require.main.filename);
  const Mongo = require(appDir + '/class/mongo.js')
  const PagesMongoSchema = require(appDir + '/class/pageschema.js')
  const UserMongoSchema=require(appDir + '/class/userschema.js')
  const Admin=require(appDir + '/class/admin.js')
  const Permission=require(appDir + '/class/permission.js')
  const Messages=require(appDir + '/class/messages.js')

  class Services {
      constructor(parent, config) {
        
          this.parent = parent;
          this.config = config;
          this.mongoaddress = this.config.db;
        
      }

      init() {
        console.log("init services")
              this._mongo = new Mongo(this, this.mongoaddress);
              this._pages = new PagesMongoSchema(this, this.config);
              this._user = new UserMongoSchema(this, this.config);
              this._admin= new Admin(this, this.config);
              this._permission= new Permission(this, this.config);
              this._messages=new Messages(this, this.config)
              this._name="Services"
              
              var userhandler=this._user;
              
              
              
              return Promise.all([
                  this._mongo.init(),
                  this._pages.init(),
                  this._user.init(),
                  this._admin.init(),
                  this._messages.init()
                  //  super.init()
              ]);
          }
          showname(){
            return this._name
          }
          // var pageshandler=this._pages;
          // handleall

  }

  module.exports = Services;