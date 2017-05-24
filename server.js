var port = 3003;
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
    console.log("Getting account data");
    database.getUserInformation(req.body,function(resp){
        console.log(resp);
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
        console.log("Sending Register Page");
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
    console.log("Getting Comments");
    var sql = "SELECT * FROM COMMENTS WHERE RESOURCE_ID = " + req.session.resource_id;
    console.log(sql);
    connection.query(sql, function(err, rows) {
        if (err) {
            throw err;
        }
        if (req.body.count < rows.length) {
            var data = {
                more: true,
                comment: rows[req.body.count].COMMENT,
                user_id: rows[req.body.count].USER_ID
            };
        } else {
            /*No More Comments*/
            var data = {
                more: false,
                comment: 0,
                user_id: 0
            };
        }
        res.json(data);
    })
});


router.post("/deleteResource", function(req, res) {
    database.deleteResource(req,res);
});

function sum(rows, total, count, cb) {
    console.log("count: " + count);
    console.log("total: " + total);
    if (count < rows.length) {
        total = total + rows[count].RATING;
        sum(rows, total, count + 1, cb);
    } else {
        if (rows.length == 0) {
            var data = {
                result: -1
            };
        } else {
            var result = Math.round(total / rows.length);
            console.log("total: " + total);
            console.log("result: " + result);
            var data = {
                result: result
            };
        }
        return cb(data);
    }
}

router.post("/getResourceData", function(req, res) {
    database.getResource(req,res, function(re){
        res.json(re);
    });
});

router.post("/getSessionData", function(req, res) {
    controller.getSessionData(function(result){
        res.json(result);
    });
});

router.post("/sendID", function(req, res) {
    console.log("Server Recieving Resource ID");
    req.session.resource_id = req.body.id;
    console.log("ID is: " + req.body.id);
    if (req.body.id > 0) { //this may be a problem
        res.json({ success: "Success", status: 200 });
    }
});
/**TCP call to add comment to DB */
router.post("/addComment", function(req, res) {
    var comment = req.body.comment;
    var sql = "INSERT INTO COMMENTS VALUES(" + req.session.resource_id + ",'" + comment + "',NULL," + req.session.mYid + ")";
    console.log(sql);
    connection.query(sql, function(err, rows) {
        if (err) {
            throw err;
        }
    });
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