var port = 3008;

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

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/images");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});
var upload = multer({ storage: storage }).single('userPhoto');


/*Setup Connection with Database */
/*This will need to be changed when placed on server */
var connection = mysql.createConnection({
    host: "localhost",
    user: "shane",
    password: "Gaming12",/*Change This First Thing*/
    database: "PROSPECTOR"
});

connection.connect(function(err) {
    if (err) {
        console.log('Error Connecting to MYSQL');
        return;
    }
    console.log("Connection Established With MYSQL");
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
/**Sends Email if User has forgoten their email */
router.post('/sendEmail', function(req, res) {
    var input = req.body.email_usr;
    var str = "SELECT * FROM ACCOUNTS WHERE USER = " + input + " OR " + input + " = EMAIL";
    console.log(str);
    connection.query(str, function(err, rows) {
        for (var i = 0; i < rows.length; i++) {
            //enter code here once email server is setup
        }
    });
});

router.post('/registerAccount', function(req, res) {
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

    var checkString = "SELECT * FROM ACCOUNTS WHERE USER = " + "'" + user + "'" + " OR EMAIL = " + "'" + email + "'";
    console.log(checkString);
    connection.query(checkString, function(err, rows) {
        if (rows.length == 0) {


            var submitString = "INSERT INTO ACCOUNTS VALUES('" + user + "','" + pass + "',NULL,'" + email + "','" + bio + "','" + ext + "');"
            console.log(submitString);
            connection.query(submitString, function(err, res) {
                console.log("Queried");
            });
            /*Finds ID number generated by MYSQL to name image file*/
            var connectionString = "SELECT * FROM ACCOUNTS WHERE USER = " + "'" + user + "' AND EMAIL ='" + email + "'";
            console.log(connectionString);
            connection.query(connectionString, function(err, rows) {
                if (err) throw err;
                console.log(rows.length);
                var id = rows[0].ID;
                fs.writeFileSync("images/" + user + id + "." + ext, buffer);
            });
            res.json({ success: "Got Data", duplicate: 0, status: 200 });


        } else {
            res.json({ success: "Got Data", duplicate: 1, status: 200 });
        }
    });

});

router.get("/", function(req, res) {
    console.log("Is Logged In " + req.session.loggedIn);
    res.render(path + "index.ejs");
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
    console.log("Receiving Resource Data From Client");
    /*Converts URL String To File of Image*/
    var base64Img = req.body.img;
    var regex = /^data:.+\/(.+);base64,(.*)$/;
    var matches = base64Img.match(regex);
    var ext = matches[1];
    var data = matches[2];
    var buffer = new Buffer(data, 'base64');
    /*Getting Input From Remaining Fields From Client and From Session*/
    var title = req.body.title;
    var address = req.body.address;
    var city = req.body.city;
    var country = req.body.country;
    var type = req.body.type;
    var coords = req.body.coords;
    var desc = req.body.desc;
    var usrID = req.session.mYid;
    /**Insert Data Into MYSQL Database*/
    switch (type) {
        case "general":
            type = 0;
            break;
        case "bio":
            type = 1;
            break;
        case "Electronic":
            type = 2;
            break;
        case "ore":
            type = 3;
            break;
        case "metal":
            type = 4;
            break;
    }

    var submitString = "INSERT INTO RESOURCES VALUES(" + usrID + ",'" + title + "','" + coords + "','" + address + "'," + type + ",NULL,'" + desc + "','" + city + "','" + country + "','" + ext + "')";
    console.log(submitString);
    connection.query(submitString, function(err, res) {
        console.log("Queried");
    });


    /*Finds ID number generated by MYSQL to name image file*/
    var connectionString = "SELECT * FROM RESOURCES WHERE TITLE = " + "'" + title + "' AND USER_DESCRIPTION ='" + desc + "'";
    console.log(connectionString);
    connection.query(connectionString, function(err, rows) {
        if (err) throw err;
        console.log(rows.length);
        var id = rows[0].ID;
        fs.writeFileSync("resourceImages/" + title + id + "." + ext, buffer);

    });
    res.json({ success: "Sent", status: 200 });
});

router.post("/logout", function(req, res) {
    console.log("logging out");
    req.session.loggedIn = false;
    res.json({ success: "Success Logging Out", status: 200 });
});

router.post("/getResources", function(req, res) {
    console.log("Getting Resources");
    if (!req.session.dbCount) {
        if (req.session.dbCount != 0) {
            req.session.dbCount = 0;
        }
    }
    var data = {
        logged: false
    }
    if (req.session.loggedIn) {
        var queryString = "SELECT * FROM RESOURCES;";
        data.logged = true;
        connection.query(queryString, function(err, rows) {
            console.log("DB Length:" + rows.length);
            console.log("Count: " + req.session.dbCount);
            if ((rows.length) >= req.session.dbCount + 1) {
            var sqlstring = "SELECT * FROM RATINGS WHERE RESOURCE_ID = " + rows[req.session.dbCount].ID;
            console.log(sqlstring);
            connection.query(sqlstring, function(err,rows_rating){
                    sum(rows_rating,0,0,function(result){
                        data.rank = result.result;
                        console.log("The Result: " + result);
                        data.moreData = true;
                        data.num_rating = rows_rating.length;
                        data.usrID = rows[req.session.dbCount].USER_ID;
                        data.title = rows[req.session.dbCount].TITLE;
                        data.coords = rows[req.session.dbCount].COORDS;
                        data.address = rows[req.session.dbCount].ADDRESS;
                        data.type = rows[req.session.dbCount].TYPE;
                        data.id = rows[req.session.dbCount].ID;
                        data.desc = rows[req.session.dbCount].USER_DESCRIPTION;
                        data.city = rows[req.session.dbCount].CITY;
                        data.country = rows[req.session.dbCount].COUNTRY;
                        data.ext = rows[req.session.dbCount].EXT;
                        var dbsqlString = "SELECT * FROM ACCOUNTS WHERE ID = " + data.usrID;
                        console.log(dbsqlString);
                        connection.query(dbsqlString, function(err, rows) {
                            data.authorExt = rows[0].PICTURE;
                            data.author = rows[0].USER;
                            console.log("The author is " + data.author);
                            req.session.dbCount++;
                            res.json(data);
                        });
                        });
        });

            } else {
                data.moreData = false;
                req.session.dbCount = 0;
                res.json(data);
            }
        });
    }
    console.log(data);

});

router.post("/deleteResource", function(req, res) {
    console.log("Double Checking That User is the Author");
    var sqlString = "SELECT * FROM RESOURCES WHERE ID = " + req.body.itemID;
    console.log(sqlString);
    connection.query(sqlString, function(err, rows) {
        /*If its the author making the request*/
        if (req.session.mYid === rows[0].USER_ID) {
            console.log("Author is deleting resource");
            var sqlString2 = "DELETE FROM RESOURCES WHERE ID = " + req.body.itemID;
            connection.query(sqlString2, function(err, rows) {
                /*Do Nothing Here */
            })
        }
    });

});

function sum(rows,total,count,cb){
                
        
        console.log("count: " + count);
        console.log("total: " + total);
        if(count < rows.length){
            total = total + rows[count].RATING;
            sum(rows,total,count+1,cb);
        }else{
            if(rows.length==0){
                var data = {
                    result : -1
                };
            }else{
                var result = Math.round(total / rows.length);
            console.log("total: " + total);
            console.log("result: " + result);
            var data = {
                result : result
                };
            }
            
            
           return cb(data);
        }
                
}

router.post("/getResourceData", function(req, res) {
    console.log("Getting Resource Data");
    if (req.session.loggedIn) {
        var id = req.session.resource_id;
        var connectionString = "SELECT * FROM RESOURCES WHERE ID = " + id;
        console.log(connectionString);
        connection.query(connectionString, function(err, rows) {
            var db_data = rows[0];
            var data = {

            };
            console.log("Getting Ratings");
            var sql = "SELECT * FROM RATINGS WHERE RESOURCE_ID = " + id;
            console.log(sql);
            connection.query(sql, function(err, rows) {
                if (err) throw err;
                sum(rows,0,0,function(result){
                     console.log(db_data.TITLE);
                data.rank = result.result;
                console.log("result: " + result.result);
                data.num_of_commentors = rows.length;
                data.title = db_data.TITLE;
                data.usrID = rows[0].USER_ID;
                data.coords = db_data.COORDS;
                data.address = db_data.ADDRESS;
                data.type = db_data.TYPE;
                data.desc = db_data.USER_DESCRIPTION;
                data.city = db_data.CITY;
                data.country = db_data.COUNTRY;
                data.extension = db_data.EXT;
                data.itemID = db_data.ID;
                data.currentID = req.session.mYid;

                var sqlString = "SELECT * FROM ACCOUNTS WHERE ID = " + data.usrID;
                connection.query(sqlString, function(err, rows) {
                    data.authorExt = rows[0].PICTURE;
                    data.authorBio = rows[0].BIO;
                    data.author = rows[0].USER;
                    res.json(data);
                    });
                });
            });
        });
    }
});

router.post("/getSessionData", function(req, res) {
    if (req.session.loggedIn) {
        var data = {
            loggedIn: req.session.loggedIn,
            id: req.session.mYid,
            user: req.session.user,
            email: req.session.email,
            ext: req.session.imgExt
        }
        res.json(data);
    } else {
        var data = {
            loggedIn: false
        }
        res.json(data);
    }

});

router.post("/sendID", function(req, res) {
    console.log("Server Recieving Resource ID");
    req.session.resource_id = req.body.id;
    console.log("ID is: " + req.body.id);
    if (req.body.id > 0) { //this may be a problem
        res.json({ success: "Success", status: 200 });
    }
});

router.post("/addRating", function(req, res) {
    console.log("Adding Rating");
    var score = req.body.score;
    var outSql = "SELECT * FROM RATINGS WHERE USER_ID = " + req.session.mYid;
    console.log(outSql);
    connection.query(outSql, function(err, rows) {
        if (rows.length > 0) {
            var editSQL = "UPDATE RATINGS SET RATING = " + score + " WHERE USER_ID = " + req.session.mYid;
            connection.query(editSQL, function(err, rows) {

            });
        } else {
            var sql = "INSERT INTO RATINGS VALUES(" + req.session.resource_id + "," + score + ",NULL," + req.session.mYid + ")";
            console.log(sql);
            connection.query(sql, function(err, rows) {

            });
            
            
        }

    });

});

router.get("/resourcePage", function(req, res) {
    console.log("Going to Resource Page");
    res.sendFile(path + "resourcePage.html");
});

router.post("/login", function(req, res) {
    console.log("recieved");
    var password = req.body.password;
    var usr = req.body.username;
    console.log(password);
    console.log(usr);

    var sqlString = "SELECT * FROM ACCOUNTS WHERE USER = " + "'" + usr + "'";
    sqlString += " OR EMAIL = " + "'" + usr + "'";
    console.log(sqlString);
    connection.query(sqlString, function(err, rows) {
        if (err) {
            throw err;
        }
        console.log('Getting Data From Database');
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                console.log("The Password: " + row.PASS);
                var thePass = row.PASS;
                if (thePass === password) {
                    req.session.loggedIn = true;
                    req.session.mYid = rows[i].ID;
                    req.session.user = rows[i].USER;
                    req.session.email = rows[i].EMAIL;
                    req.session.bio = rows[i].BIO;
                    /*Picture Extension*/
                    req.session.imgExt = rows[i].PICTURE;
                    res.json({ success: "Data Transfer", match: 1, status: 200 });
                } else {
                    res.json({ success: "Data Transfer", match: 0, status: 200 });
                }
            }
        } else {
            res.json({ success: "Data Transfer", match: 0, status: 200 });
        }
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