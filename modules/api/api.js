var express = require('express')
var router = express.Router()
const path = require('path');
var appDir = path.dirname(require.main.filename);
var mime = require('mime');
var http = require('http');
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })




router.route('/images/getone')
    .post(function(req, res) {
        const fs = require('fs');
        var queryBy = req.body.Name;
        var queryDir = req.body.Dir;
        console.log(queryBy)
            // res.send(queryBy)
        var pathtofile = path.join(appDir, '/uploads/' + queryDir + "/" + queryBy)
        var filename = path.basename(pathtofile);
        var mimetype = mime.lookup(pathtofile);
        console.log(mimetype)
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        var filestream = fs.createReadStream(pathtofile);
        filestream.pipe(res);

    })
router.route('/images')
    .post(function(req, res) {
        const path = require('path');
        var appDir = path.dirname(require.main.filename);
        const e = require('thenify'); // moduł umożliwiający obsługę Promise przez klasyczne metody Node.js
        const thenify = require('thenify');
        const fs = require('fs');
        const base = path.join(appDir, "/uploads/");
        var temp = {}

        function getDirectories(srcpath) {
            return fs.readdirSync(srcpath)
                .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
        }
        var tempdirs = getDirectories(base);

        tempdirs.forEach(dir => {
            if (!temp[dir]) temp[dir] = {};

            var tempdir = path.join(base, dir);
            tempdir = path.join(tempdir, "/")

            var files = fs.readdirSync(tempdir)
            console.log("files" + files)
            files.forEach(file => {

                temp[dir][file] = file;
                console.log("temp    " + temp[dir])
            });
            console.log(temp)



        });
        res.send(JSON.stringify(temp))

    })
    .get(function(req, res) {



    })
router.route('/')
    .post(function(req, res) {
        res.status(404).send('Specify API');
    })
    .get(function(req, res) {
        res.status(404).send('Specify API');
    })

router.route('/')
    .post(function(req, res) {
        res.status(404).send('No such method in API');
    })
    .get(function(req, res) {
        res.status(404).send('No such method');
    })
module.exports = router