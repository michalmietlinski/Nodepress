var express = require('express')
var router = express.Router()
const path = require('path');     
var appDir = path.dirname(require.main.filename);
var mongoose = require(path.join(appDir, '/modules/database/mongoose.js'));
var user = require(path.join(appDir, '/modules/database/schemas/user.js'));
router.use(function timeLog (req, res, next) {
  // console.log('Time: ', Date.now())
  next()
})
router.route('/')
	.post(function(req,res){
		res.send('Hello POST');
	})
	.get(function(req,res){
		console.log(req.query.p)


		var p = req.query.p;
		console.log(p)


		
		user.activate(p).then(function(){
				res.send("done")

		}).catch(function(err){

				res.send(err)
		})



	
	
	})

module.exports = router