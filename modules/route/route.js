var express = require('express')
var router = express.Router()
const path = require('path');     
var appDir = path.dirname(require.main.filename);

var isAuthenticated = function (req, res, next) {

  if (req.isAuthenticated()){
  	console.log(req.user)
    return next();
    }
  res.redirect('/login');
}

router.use(function timeLog (req, res, next) {
  // console.log('Time: ', Date.now())
  next()
})
router.route('/')
	.post(function(req,res){
		res.send('Hello POST');
	})
	.get(isAuthenticated, function(req,res){

	
	res.sendFile(appDir + '/templates/index.html');
	
	})

module.exports = router