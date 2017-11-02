var express = require('express')
var router = express.Router()
const path = require('path');
var appDir = path.dirname(require.main.filename);
var fs = require('fs');
var hbs = require('hbs');

hbs.registerPartial('partial', fs.readFileSync(appDir + '/templates/hbs/partial.hbs', 'utf8'));
hbs.registerPartials(appDir + '/templates/hbs/partials');
// router.set('view engine', 'hbs');
// router.set('views', appDir + '/templates/hbs');

router.use(function timeLog (req, res, next) {
  // console.log('Time: ', Date.now())
  next()
})
router.route('/')
    .post(function(req, res) {
        res.send('Hello POST');
    })
    .get(function(req, res) {


        res.locals = {
            title: "ssij",
        some_value: 'foo bar',
        list: ['cat', 'dog']
    }
    if(req.user){
                res.locals.Userlogged=true;
            }

    res.render(appDir + '/templates/hbs/layout.hbs');

    })

module.exports = router