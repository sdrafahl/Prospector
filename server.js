var port = 4008;

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
var multer = require('multer');
var engine = require('ejs-locals');
var ejsLayouts = require("express-ejs-layouts");


var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/images");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({ storage : storage}).single('userPhoto');


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
app.use(ejsLayouts);
app.use(bodyParser.json());
app.use(express.static(__dirname)); 
//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
//app.set('view options', { layout:'layout.ejs' });
app.engine('ejs', engine);
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

app.post("/api/photo",function(req,res){
    
    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

router.post('/registerAccount',function(req,res){
  console.log("Registering Account");
  var pass = req.body.pass;
  console.log(pass);
  var email = req.body.email;
  var user = req.body.usr;
  var bio = req.body.bio;
  var base64Img = req.body.img;
  var regex = /^data:.+\/(.+);base64,(.*)$/;
  var matches = base64Img.match(regex);
  var ext = matches[1];
  var data = matches[2];
  var buffer = new Buffer(data, 'base64');
  

  var submitString = "INSERT INTO ACCOUNTS VALUES('" + user +"','" + pass + "',NULL,'" + email + "','" + bio + "','" + ext + "');"
  console.log(submitString);
  connection.query(submitString, function(err,res){
    console.log("Queried");
});
  /*Finds ID number generated by MYSQL to name image file*/
  var connectionString = "SELECT * FROM ACCOUNTS WHERE USER = " + "'" + user + "' AND EMAIL ='" + email + "'";
  console.log(connectionString);
  connection.query(connectionString,function(err,rows){
    if(err) throw err;
    console.log(rows.length);
    var id = rows[0].ID;
    fs.writeFileSync("images/" + user + id +"."+ ext, buffer);
  });
  res.json({success : "Registered Account", status : 200}); 
});

router.get("/",function(req,res){
  console.log("Is Logged In " + req.session.loggedIn);
  res.render(path + "index.ejs");
});

router.get("/about",function(req,res){
  res.render(path + "about.ejs");
});
router.get("/forgot",function(req,res){
  res.sendFile(path + "forgotPassword.html");
});
router.get("/resources",function(req,res){
  res.render(path + "resources.ejs");
});
router.get("/submit", function(req,res){
  console.log("Sending Register Page");
  res.sendFile(path + "submit.html");
});
router.get("/register", function(req,res){
  
  res.sendFile(path + "register.html")
});


router.post("/logout", function(req,res){
  console.log("logging out");
  req.session.loggedIn=false;
  res.json({success : "Success Logging Out", status : 200}); 
});

router.post("/getResources",function(req,res){
  console.log("Getting Resources");
  if(!req.session.dbCount){
    if(req.session.dbCount!=0){
      req.session.dbCount=0;
    }
  }
  var data = {
    logged: false
  }
  if(req.session.loggedIn){
    var queryString = "SELECT * FROM RESOURCES;";
    data.logged=true;
    connection.query(queryString, function(err,rows){
      console.log("DB Length:" + rows.length);
      console.log("Count: " + req.session.dbCount);
      if((rows.length)>=req.session.dbCount+1){
        data.moreData=true;
        data.usrID= rows[req.session.dbCount].USER_ID;
        data.title= rows[req.session.dbCount].TITLE;
        data.coords= rows[req.session.dbCount].COORDS;
        data.address = rows[req.session.dbCount].ADDRESS;
        data.type= rows[req.session.dbCount].TYPE;
        data.id= rows[req.session.dbCount].ID;
        data.desc= rows[req.session.dbCount].USER_DESCRIPTION;
        data.city= rows[req.session.dbCount].CITY;
        data.country= rows[req.session.dbCount].COUNTRY;
        req.session.dbCount++;
        res.json(data);

    }else{
        data.moreData=false;
        req.session.dbCount=0;
        res.json(data);
      }
    });
  }
console.log(data);

});



router.post("/getSessionData", function(req,res){
  if(req.session.loggedIn){
    var data = {
    loggedIn : req.session.loggedIn,
    id: req.session.mYid,
    user: req.session.user,
    email: req.session.email,
    ext: req.session.imgExt
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
        req.session.loggedIn = true;
        req.session.mYid = rows[i].ID;
        req.session.user = rows[i].USER;
        req.session.email = rows[i].EMAIL;
        /*Picture Extension*/
        req.session.imgExt = rows[i].PICTURE;
        res.json({success : "Found Match", status : 200}); 
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