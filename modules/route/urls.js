var express = require('express')
var router = express.Router()
const path = require('path');
var appDir = path.dirname(require.main.filename);
const thenify = require('thenify');
var mongoose = require(path.join(appDir, '/modules/database/mongoose.js'));
var page= require(path.join(appDir, '/modules/database/schemas/page.js'));
var permissions = require(path.join(appDir, '/modules/permissions/permissions.js'));
var hbs = require('hbs');
hbs.registerPartials(appDir + '/templates/hbs/partials');
var config = require(appDir + '/modules/config/config.js')


module.exports = function(req, res, next) {
    hbs.registerHelper('loggin', function() {
        if (req.user) return req.user.username;
        return ""
    });
    hbs.registerHelper('roles', function() {
        var out = "<select name='role'>";
        for (var i = 0; i < config.availlableRoles.length; i++) {


            out += "<option>" + config.availlableRoles[i] + "</option>";
        }
        out += '</select>'
        return out
    });

    var temp = page.find(req,req.originalUrl);
    temp.then(function(resp) {
        if (resp) {
            // console.log("//////////////////////////////")
            // console.log(resp)
            if (!resp.level || permissions.bylevel(req, res, resp.level)) {
                if (resp.header) {
                    res.locals.header = resp.header
                }
                if (resp.mainbody) {
                    res.locals.mainbody = resp.mainbody
                }
                if (req.user) {
                    res.locals.Userlogged = true;
                }else{
                    res.locals.Usernotlogged=true;
                }

                res.render(resp.theme + '.hbs');
            } else {
                res.redirect("/login")
                    //res.sendFile(appDir + '/templates/'+resp.theme+'.html');

            }
        } else {
            next();
        }



    })


}