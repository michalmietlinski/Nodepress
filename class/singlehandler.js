"use strict";
const path = require('path');
const appDir = path.dirname(require.main.filename);
const permissions = require(path.join(appDir, '/modules/permissions/permissions.js'));
class singleHandler {
    constructor(parent, config, page) {

        this.parent = parent;
        this.config = config;
        this.page = page;
        this.getpage = function(req, res) {
            var page = this.page;
            if (!page.level || permissions.bylevel(req, res, page.level)) {

                if (page.header) {
                    res.locals.header = page.header
                }
                if (page.mainbody) {
                    res.locals.mainbody = page.mainbody
                }
                if (req.user) {
                    res.locals.Userlogged = true;
                    res.locals.User = req.user;
                } else {
                    res.locals.Usernotlogged = true;
                }
                res.render(page.theme + '.hbs');
            } else {
                res.redirect("/login")
            }

        }
    }

}


module.exports = singleHandler