
const path = require('path');           
const express = require('express');     
const app = express();

//Routes:
var API = require(path.join(__dirname, '/modules/api/api.js'))
var error404 = require(path.join(__dirname, '/modules/route/404.js'));
var urls= require('./modules/route/urls.js')
var profilehtml= require( './modules/route/profile.js')
var adminhtml= require( './modules/route/admin.js')

//Database
var mongoose=require(path.join(__dirname, '/modules/database/mongoose.js'));
mongoose.init();
// mongoose.init2();
//Login and authorization
var logouthtml= require( './modules/route/logout.js')
var loginhtml = require( './modules/route/login.js')
var activate= require( './modules/route/activate.js')
var passport = require('passport');
var session = require('express-session');
require(path.join(__dirname, '/modules/passport/passport.js'))(passport);

//Parsing Body
var bodyParser = require('body-parser');
app.use(bodyParser());

//Config
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session());

//Handlebars
const hbs = require('hbs');
app.set('view engine', 'hbs');
app.set('views', './templates/hbs');

//Routing
app.use('/api', API)
app.use("/auth",loginhtml(passport))
app.use("/profile",profilehtml)
app.use("/logout",logouthtml)
app.use("/activate*",activate)
app.use("/admin",adminhtml)
app.use(express.static(path.join(__dirname, '/public')));
//Catch - all
app.use("*",urls,error404)


//Server start
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


// Not used anymore:
// var database=require(path.join(__dirname, '/modules/database/mongo.js'));
// var registerhtml= require( './modules/route/register.js')
// var resethtml= require( './modules/route/resetpassword.js')
// var hbser= require( './modules/templates/hbs.js')
// var statichtml = require(path.join(__dirname, '/modules/route/route.js'))
// var uploadhtml = require(path.join(__dirname, '/modules/route/upload.js'))
// var email= require( './modules/email/email.js')
// app.use("/upload",uploadhtml);
// app.use("/register",registerhtml)
// app.use("/reset",resethtml)
// app.use("/hbs",hbser)
// app.use('/', statichtml)


//Testing
//mongoose.testing();
// mongoose.addUser("test","dfddf","ddsfsd@dsdfs.pl","gender","dfsfdsfds")
//mongoose.findpage("/loginsdsdasa")
// mongoose.finduser("test1");
//email();