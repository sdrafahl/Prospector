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

var Email = require('./node/email.js');
var cluster = require('cluster');

app.use(ejsLayouts);
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.set('view engine', 'ejs');
app.engine('ejs', engine);
app.use(cookieParser('SecretCode'));

var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
      callback(null, __dirname + "/images");
  },
  filename: function(req, file, callback) {
      callback(null, file.fieldname + '-' + Date.now());
  }
});
  var router = require('./node/router.js');

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
