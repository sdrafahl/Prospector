var port = 3003;
var fs = require('fs');
var express = require("express");
var app = express();
var path = __dirname + '/views/';
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
var router = require('./node/router.js');
app.use(router);
app.use("/", router);
app.use("*", function(req, res) {
    res.sendFile(path + "404.html");
});

app.listen(port, function() {
    console.log("Live at Port: " + port);
});