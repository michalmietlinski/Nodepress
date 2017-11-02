'use strict';

var express = require('express')
var router = express.Router()
const path = require('path');
var appDir = path.dirname(require.main.filename);

//???!!
module.exports.init= function(hbs, modules){
 modules.forEach(function(key){
   hbs.registerHelper(lib[key])
 })
  
}
