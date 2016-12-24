var port = 3003;

var express = require("express");
var app = express();
var path = __dirname + '/views/';
var http = require('http');
var NodeSession = require('node-session');
var session = require('express-session');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(__dirname)); 
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(cookieParser('SecretCode'));
app.use(session({
  secret: '1234567890QWERTY',
  resave: true,
  saveUninitialized: true
}));

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

router.get("/about",function(req,res){
  res.sendFile(path + "about.html");
});

router.get("/resources",function(req,res){
  res.sendFile(path + "resources.html");
});

router.post("/getImage", function(req,res){
  
});
router.post("/login", function(req,res){
  //var password = req.body.value.password;
  //var usr = req.body.value.user;
  //console.log(password);
  //console.log(usr);
  console.log("recieved");

});

router.get("/loginScreen", function(req,res){
  console.log("Loging In");
  res.sendFile(path + "login.html");
});

app.use("/",router);
app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(port,function(){
  console.log("Live at Port: " + port);
});