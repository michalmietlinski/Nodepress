var express = require('express')
var router = express.Router()
const path = require('path');     
var appDir = path.dirname(require.main.filename);

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
router.route('/')
	.post(function(req,res){
		res.status(404).send('No such method');
	})
	.get( function(req,res){

		
	res.sendFile(appDir + '/templates/404.html');
	
	})

module.exports = router