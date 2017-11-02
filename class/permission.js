"use strict";
const path = require('path');
const appDir = path.dirname(require.main.filename);

class permission {
    constructor(parent, config) {
        this.parent = parent;
        this.config = config;
    }


   permissionbylevel(req, res, level) {
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

  permissionbyrole(req, role) {
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
  permissionbyauthor(req,res){


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

}

module.exports = permission;