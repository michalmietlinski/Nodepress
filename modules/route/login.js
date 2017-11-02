var express = require('express')
var router = express.Router()
const path = require('path');     
var appDir = path.dirname(require.main.filename);
var mongoose=require(path.join(appDir, '/modules/database/mongoose.js'));

module.exports = function(passport){
router.use(function timeLog (req, res, next) {
  console.log('Time of login: ', Date.now())
  next()
})
router.route('/')
	.post(passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                              failureFlash: false, session: true })
	)
	.get( function(req,res){


	res.sendFile(appDir + '/templates/login.html');
	
	})
	return router;
}