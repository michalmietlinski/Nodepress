"use strict";
var express = require('express')
const path = require('path');
const App= require('./class/server/apps.js');
const cfg= require('./modules/config/config.js')
const Services=require('./class/services.js')
class AppModule {
        constructor(parent) {
            this.parent = parent;
        }

        init() {
            return Promise.resolve();
        }

        get config() { this._config || this.parent.config }
    }

      class Controller extends AppModule {

        constructor(config, owner) {
            super(owner);
            this._config = config;
            this._Services = new Services(this,config);
            this._app = new App(this);
            
        }
        get services(){
            return this._Services
        }
        init() {
            return Promise.all([
                this._Services.init(),
                this._app.init(this._Services),
                super.init()
            ]);
        }

        static getInstance() {
            return new Controller();
        }
    }


var AppInstance=new Controller(cfg);
        AppInstance.init()
        .then(
            (info) => {
            console.log("server running")//,info
            
            }
        )
        .catch(
            (err) => console.log(err)
        )
    ;