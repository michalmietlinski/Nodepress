var express = require('express')
var router = express.Router()
const path = require('path');
var appDir = path.dirname(require.main.filename);
var mongoose = require('mongoose');




function permissionbylevel(req, res, level) {
    if (level) {
        if (req.isAuthenticated()) {
            if (req.user.level && req.user.level >= level) {
                console.log("cool level")
                return true
            } else {
                console.log("low level")
                return false
            }
        } else {
            console.log("not logged")
            return false

        }
    } else {
        return true
    }
}

function permissionbyrole(req, role) {
    console.log(role    )
    if (role && role != "All") {
        if (req.isAuthenticated()) {
            if (req.user.role && req.user.role == role) {
                console.log("cool role")
                return true
            } else {
                console.log("low role")
                return false
            }
        } else {
            console.log("not logged")
            return false

        }
    } else {
        return true
    }
}
function permissionbyauthor(req,res){


        if (req.isAuthenticated()) {
            var authorsof=mongoose.findelement(schema, val, comp)
            authorsof.then(function(resp){
                if (req.user.username && req.user.username == resp.author) {
                console.log("cool role")
                return true
            } else {
                console.log("low role")
                return false
            }

            })
            
        } else {
            console.log("not logged")
            return false

        }
    


}
// function permissionbyfunction(funct){
//     function(req, res, next){

//     }

// }

module.exports.bylevel = permissionbylevel
module.exports.byrole=permissionbyrole