var port = 3003;
var fs = require('fs');
var express = require("express");
var app = express();
var path = __dirname + '/views/';
var imagePath = __dirname + './images/';
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
/*Modules I Created*/
var DataBase = require('./node/database.js');
var database = new DataBase();
var Email = require('./node/email.js');
var NonDataBaseControler = require('./node/NonDataBaseControler.js');
var controller = new NonDataBaseControler();

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "../images");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});
var upload = multer({ storage: storage }).single('userPhoto');


/*Setup Connection with Database */
/*This will need to be changed when placed on server */
var connection = mysql.createConnection({
    host: "",
    user: "shane",
    password: "devPassword",
    /*Change This First Thing*/
    database: "PROSPECTOR"
});


connection.connect(function(err) {
    if (err) {
        console.log('Error Connecting to MYSQL');
        return;
    }
    console.log("Connection Established With MYSQL");
});

var email = new Email(connection);

/**********************************************/
app.use(ejsLayouts);
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.set('view engine', 'ejs');
app.engine('ejs', engine);
app.use(cookieParser('SecretCode'));
app.use(session({
    secret: '1234567890QWERTY',
    resave: true,
    saveUninitialized: true
}));

router.use(function(req, res, next) {
    console.log("/" + req.method);
    next();
});

app.post("/api/photo", function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

app.get("/index", function(req, res) {
    res.render(path + "index.ejs");
});

/**Sends Email if User has forgoten their email */
router.post('/sendEmail', function(req, res) {
    email.sendEmail(req);
});

router.post('/getAccoundDataWithID', function(req,res){
    database.getUserInformation(req.body,function(resp){
        res.json(resp);
    });
});

router.post('/registerAccount', function(req, res) {
    database.registerAccount(req,res,function(result){
        res.json(result);
    });
});

router.get("/", function(req, res) {
    console.log("Is Logged In " + req.session.loggedIn);
    res.sendFile(path + "login.html");
});

router.get("/about", function(req, res) {
    res.render(path + "about.ejs");
});
router.get("/forgot", function(req, res) {
    res.sendFile(path + "forgotPassword.html");
});
router.get("/resources", function(req, res) {
    res.render(path + "resources.ejs");
});
router.get("/submit", function(req, res) {
    if (req.session.loggedIn) {
        res.sendFile(path + "submit.html");
    } else {
        console.log("User Not Logged In Is Trying to Submit");
    }
});
router.get("/register", function(req, res) {
    res.sendFile(path + "register.html");
});

router.post("/submitData", function(req, res) {
    database.submitData(req,res,function(result){
        req.json(result);
    });
});

router.post("/logout", function(req, res) {
    console.log("logging out");
    req.session.loggedIn = false;
    res.json({ success: "Success Logging Out", status: 200 });
});

router.post("/getResources", function(req, res) {
    database.getResources(req,res,function(result){
        res.json(result);
    });
});

router.post("/getComments", function(req, res) {
    database.getComment(req,function(result){
        res.json(result);
    });
});


router.post("/deleteResource", function(req, res) {
    database.deleteResource(req,res);
});

router.post("/getResourceData", function(req, res) {
    database.getResource(req,res, function(re){
        res.json(re);
    });
});

router.post("/getSessionData", function(req, res) {
    controller.getSessionData(req,res,function(result){
        res.json(result);
    });
});

router.post("/sendID", function(req, res) {
   controller.sendID(req,function(result){
    res.json(result);
   });
});

router.post("/addComment", function(req, res) {
    database.addComment(req);
});

router.post("/addRating", function(req, res) {
    console.log("Adding Rating");
    database.addRatingDb(req,res);
});

router.get("/resourcePage", function(req, res) {
    console.log("Going to Resource Page");
    res.sendFile(path + "resourcePage.html");
});

router.post("/login", function(req, res) {
    database.login(req,res,function(result){
        res.json(result);
    });
});

router.get("/loginScreen", function(req, res) {
    console.log("Loging In");
    res.sendFile(path + "login.html");
});

app.use("/", router);
app.use("*", function(req, res) {
    res.sendFile(path + "404.html");
});

app.listen(port, function() {
    console.log("Live at Port: " + port);
});