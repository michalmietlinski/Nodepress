 "use strict";
const path = require('path');
const appDir = path.dirname(require.main.filename);
const permissions = require(path.join(appDir, '/modules/permissions/permissions.js'));


class Databasemethods {
    constructor(parent, config, schema) {

        this._parent = parent;
        this._config = config;
        this._schema = schema

    }
    findbyquery(query){
     var temp =this._schema;
          return new Promise(function(resolve, reject) {
              // if (permissions.byrole(req, config.availlablePermission['Page']['Read'])) {
                  temp.find(query, function(err, result) {
                     // console.log(result)
                      if (err) reject(err);
                      resolve(result[0]);
                  });
              // } else {
              //     resolve("Permission")
              // }
          });
      }
    findbyID(req, ID) {
     var temp =this._schema;
          return new Promise(function(resolve, reject) {
              // if (permissions.byrole(req, config.availlablePermission['Page']['Read'])) {
                  temp.find({
                      _id: ID
                  }, function(err, result) {
                     // console.log(result)
                      if (err) reject(err);
                      resolve(result[0]);
                  });
              // } else {
              //     resolve("Permission")
              // }
          });
      }
    findall() {
        var temp =this._schema;
        return new Promise(function(resolve, reject) {
            // if (permissions.byrole(req, config.availlablePermission['Page']['Read'])) {
            temp.find({}, function(err, result) {
                if (err) reject(err);
                resolve(result);
            });
            // } else {
            //     resolve("Permission")
            // }
        });

    }
    remove(req, ID) {
        var temp =this._schema;
        return new Promise(function(resolve, reject) {
            // if (permissions.byrole(req, config.availlablePermission['Page']['Remove'])) {
            temp.find({
                _id: ID
            }).remove(
                function(err, pages) {
                    if (err) reject(err);
                    temp.findById(ID, function(err, pages) {
                        console.log("pages--" + pages) // null
                        if (!pages) {
                            resolve("Done")
                        }
                    })

                }).exec();
             // }else{resolve("Permission")}
        });
   
}

}

module.exports = Databasemethods