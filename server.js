var express = require("express");
var app = express();

var path = __dirname + '/views/';
var http = require('http');
var redis = require("redis").createClient();
var session = require('express-session');
var RedisStore = require("connect-redis")(session);
var router = express.Router();
app.use(express.static(__dirname)); 
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var cookieParser = require('cookie-parser');
app.use(cookieParser({"secret": "secretStuff"}));

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

router.get("/loginScreen", function(req,res){
  console.log("Loging In");
  res.sendFile(path + "login.html");
});


app.use(session({
  secret: 'secret',

  store: new RedisStore({host: 'localhost',port:6379}),
  saveUninitialized: false,
  resave: false
}));



app.use("/",router);
app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
});