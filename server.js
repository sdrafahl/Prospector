var port = 3000;
var fs = require('fs');
var express = require("express");
var app = express();
var path = __dirname + '/views/';
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require("mysql");
var multer = require('multer');
var engine = require('ejs-locals');
var ejsLayouts = require("express-ejs-layouts");
/*Modules I Created*/
var Email = require('./node/email.js');
var NonDataBaseControler = require('./node/NonDataBaseControler.js');
var cluster = require('cluster');

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
    var controller = new NonDataBaseControler();
    var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "../images");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});


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


var router = require('./node/router.js');
app.use("/", router);
app.use("*", function(req, res) {
    res.sendFile(path + "404.html");
});

app.listen(port, function() {
    console.log("Live at Port: " + port);
});

}

