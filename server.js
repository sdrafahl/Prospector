var port = 3000;
var fs = require('fs');
var express = require("express");
var app = express();
var path = __dirname + '/views/';
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require("mysql");
var engine = require('ejs-locals');
var ejsLayouts = require("express-ejs-layouts");
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var Email = require('./node/email.js');
var cluster = require('cluster');
var NonDataBaseControler = require('./node/NonDataBaseControler.js');
var DataBase = require('./node/database.js');
var Email = require('./node/email.js');
var router = require('./node/router.js');

app.use(ejsLayouts);
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.set('view engine', 'ejs');
app.engine('ejs', engine);
app.use(cookieParser('SecretCode'));

app.use(session({ store: new RedisStore({ host:'127.0.0.1', port:6380, prefix:'sess'}),
    secret: 'SEKR37',
    resave: true,
    saveUninitialized: true,
}));

var database = new DataBase(session);
var email = new Email(database);
var controller = new NonDataBaseControler(session);

var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
      callback(null, __dirname + "/images");
  },
  filename: function(req, file, callback) {
      callback(null, file.fieldname + '-' + Date.now());
  }
});

if(cluster.isMaster) {
    const numCPUs = require('os').cpus().length;
    console.log('Master Cluster is Starting...');

    for(var i = 0;i < numCPUs;i++){
        cluster.fork();
    }

    cluster.on('online', function(cluster) {
        console.log('Cluster ' + cluster.process.pid + ' is online');
    });

    cluster.on('exit', function(cluster, code, signal) {
        console.log('Cluster ' + cluster.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new cluster');
        cluster.fork();
    });
} else {

    app.use("/", router);
    app.use("*", function(req, res) {
        res.sendFile(path + "404.html");
    });

    app.listen(port, function() {
        console.log("Live at Port: " + port);
    });
}
