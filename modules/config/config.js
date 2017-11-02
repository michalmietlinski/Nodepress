
var express = require('express')

const config={
   availlableRoles:['admin','moderator','user'],
   availlableLevels:{'admin': 0, 'moderator':3,'user':2},
   availlablePageTypes:['page','post','custom'],
   availlablePermission:{
    'Page':{
     'Read':'All',
     'Write':'All',
     'Remove':'Admin',
     'Add':'All'
    },
    'User':{
     'Read':'All',
     'Write':'All',
     'Remove':'Admin',
     'Add':'All'
    }
   },
   db:'mongodb://localhost:27017/heroku'
}


module.exports = config;