var fs = require('fs');
var express = require("express");
var router = express.Router();
var path = __dirname + '/../views/';
var imagePath = __dirname + './images/';
var http = require('http');
var NodeSession = require('node-session');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require("mysql");
var multer = require('multer');
var engine = require('ejs-locals');
var ejsLayouts = require("express-ejs-layouts");
/*Modules I Created*/
var DataBase = require('./database.js');
var database = new DataBase();
var Email = require('./email.js');
var NonDataBaseControler = require('./NonDataBaseControler.js');
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

router.use(function(req, res, next) {
    console.log("/" + req.method);
    next();
});

var email = new Email(database);

router.post("/api/photo", function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

router.get("/index", function(req, res) {
    res.render("index.ejs", {root: path});
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
    res.sendFile("login.html", {root: path});
});

router.get("/about", function(req, res) {
    res.render("about.ejs", {root: path});
});
router.get("/forgot", function(req, res) {
    res.sendFile("forgotPassword.html", {root: path});
});
router.get("/resources", function(req, res) {
    res.render("resources.ejs", {root: path});
});
router.get("/submit", function(req, res) {
    if (req.session.loggedIn) {
        res.sendFile("submit.html", {root: path});
    } else {
        console.log("User Not Logged In Is Trying to Submit");
    }
});
router.get("/register", function(req, res) {
    res.sendFile("register.html",  {root: path});
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
    res.sendFile("resourcePage.html",  {root: path});
});

router.post("/login", function(req, res) {
    database.login(req,res,function(result){
        res.json(result);
    });
});

router.get("/loginScreen", function(req, res) {
    console.log("Loging In");
    res.sendFile("login.html", {root: path});
});

router.get("/Reset-Password", function(req, res){
    console.log("Reset Password Page");
    res.sendFile("resetPassword.html", {root: path});
});

router.post("/resetPassword", function(req, res){
    
});

router.post("/")

module.exports = router;