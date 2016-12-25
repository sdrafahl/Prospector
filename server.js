var port = 2022;

var fs = require('fs');
var express = require("express");
var app = express();
var path = __dirname + '/views/';
var imagePath = __dirname + '/images/';
var http = require('http');
var NodeSession = require('node-session');
var session = require('express-session');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require("mysql");


/*Setup Connection with Database */
/*This will need to be changed when placed on server */
var connection = mysql.createConnection({
  host: "localhost",
  user: "shane",
  password: "Gaming12",
  database: "PROSPECTOR"
});

connection.connect(function(err){
  if(err){
    console.log('Error Connecting to MYSQL');
    return;
  }
  console.log("Connection Established With MYSQL");
});

//connection.end(function(err){

//});
/**********************************************/

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
  console.log("Is Logged In" + req.session.loggedIn);
  res.sendFile(path + "index.html");
});

router.get("/about",function(req,res){
  res.sendFile(path + "about.html");
});

router.get("/resources",function(req,res){
  res.sendFile(path + "resources.html");
});

router.post("/getImage", function(req,res){
  var imageName;
  if(req.session.loggedIn){
     imageName = " " + req.session.user + req.session.mYid + ".jpg";
  }else{
    imageName = "images.jpg";
  }
  fs.readFile(imagePath+imageName, function(err,data){
    if(err){
      throw err;
    }
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.json(data);
    //res.end()
  });
});

router.post("/getSessionData", function(req,res){
  if(req.session.loggedIn){
    var data = {
    loggedIn : req.session.loggedIn,
    id: req.session.id,
    user: req.session.user,
    email: req.session.email
  }
    res.json(data);
  }else{
     var data = {
    loggedIn : false
  }
  res.json(data);
}
  
});

router.post("/login", function(req,res){
  console.log("recieved");
  var password = req.body.password;
  var usr = req.body.username;  
  console.log(password);
  console.log(usr);
 
  var sqlString = "SELECT * FROM ACCOUNTS WHERE USER = " +"'"+ usr + "'";
  sqlString+=" OR EMAIL = " + "'" + usr + "'";
  console.log(sqlString);
  connection.query(sqlString, function(err,rows){
    if(err){
      throw err;
    }
    console.log('Getting Data From Database');
    for(var i = 0;i<rows.length;i++){
      var row = rows[i];
      console.log("The Password: " + row.PASS);
      var thePass = row.PASS;
      if(thePass===password){
        res.json({success : "Found Match", status : 200});
        req.session.loggedIn = true;
        req.session.mYid = rows[i].ID;
        req.session.user = rows[i].USER;
        req.session.email = rows[i].EMAIL;
        
    }
    }
  });
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