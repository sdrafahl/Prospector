var method = dataBaseModule.prototype;

var fs = require('fs');
var mysql = require("mysql");
var bcrypt = require('bcrypt');

function dataBaseModule() {
    
    this.connection = mysql.createConnection({
        host: "",
        user: "shane",
        password: "devPassword",
        /*Change This First Thing*/
        database: "PROSPECTOR"
        });
    
    this.connection.connect(function(err) {
        if (err) {
            console.log('Error Connecting to MYSQL');
            return;
        }
        console.log("Connection Established With MYSQL");
    });

};

method.getUserInformation = function(json_input,cb){
    var sql = "SELECT * FROM ACCOUNTS WHERE ID = " + json_input.id;
    console.log(sql);
    this.connection.query(sql, function(err,rows){
        if(err){
            throw err;
        }
        console.log(rows[0]);
        return cb(rows[0]);

    });
}

method.getUserWithEmailandUser = function(req, cb){
    var input = req.body.email_usr;
    var str = "SELECT * FROM ACCOUNTS WHERE USER = " + input + " OR " + input + " = EMAIL";
    console.log(str);
    this.connection.query(str, function(err, rows){
        if(err){
            throw err;
        }
        return cb(rows);
    });
}

method.registerAccount = function(req,res,cb){
    console.log("Registering Account");
    var pass = hashPassword(req.body.pass);
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
    var connection = this.connection;

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
           return cb({ success: "Got Data", duplicate: 0, status: 200 });


        } else {
           return cb({ success: "Got Data", duplicate: 1, status: 200 });
        }
    });
}

function hashPassword(password){
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password,salt);
}

method.submitData = function(req,res,cb){
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
    var connection = this.connection;
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
    return cb({ success: "Sent", status: 200 });
}

method.getResource = function(req,res,cb){
    console.log("Getting Resource Data");
    if (req.session.loggedIn) {
        var id = req.session.resource_id;
        var connectionString = "SELECT * FROM RESOURCES WHERE ID = " + id;
        var connection = this.connection;
        console.log(connectionString);
        connection.query(connectionString, function(err, rows) {
            var db_data = rows[0];
            var data = {

            };
            console.log("Getting Ratings");
            var sql = "SELECT * FROM RATINGS WHERE RESOURCE_ID = " + id;
            console.log(sql);
            connection.query(sql, function(err, rows_in) {
                if (err) throw err;
                sum(rows_in, 0, 0, function(result) {
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
                        return cb(data);
                    });
                });
            });
        });
    }
}

method.deleteResource = function(req,res){
    console.log("Double Checking That User is the Author");
    var sqlString = "SELECT * FROM RESOURCES WHERE ID = " + req.body.itemID;
    console.log(sqlString);
    var connection = this.connection;
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
}


method.login = function(req,res,cb){
    console.log("recieved");
    var password = req.body.password;
    var usr = req.body.username;
    console.log(password);
    console.log(usr);
    var connection = this.connection;

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
                if (isValidPassword(password,thePass)) {
                    req.session.loggedIn = true;
                    req.session.mYid = rows[i].ID;
                    req.session.user = rows[i].USER;
                    req.session.email = rows[i].EMAIL;
                    req.session.bio = rows[i].BIO;
                    /*Picture Extension*/
                    req.session.imgExt = rows[i].PICTURE;
                    res.json({ success: "Data Transfer", match: 1, status: 200 });
                } else {
                    return cb({ success: "Data Transfer", match: 0, status: 200 });
                }
            }
        } else {
            return cb({ success: "Data Transfer", match: 0, status: 200 });
        }
    });
}

function isValidPassword(password,hash){
    return bcrypt.compareSync(password, hash)
}

method.addRatingDb = function(req,res){
    console.log("Adding Rating");
    var score = req.body.score;
    var outSql = "SELECT * FROM RATINGS WHERE USER_ID = " + req.session.mYid + " AND RESOURCE_ID = " + req.session.resource_id;
    console.log(outSql);
    var connection = this.connection;
    connection.query(outSql, function(err, rows) {
        if (rows.length > 0) {
            var editSQL = "UPDATE RATINGS SET RATING = " + score + " WHERE USER_ID = " + req.session.mYid + " AND RESOURCE_ID = " + req.session.resource_id;
            connection.query(editSQL, function(err, rows) {

            });
        } else {
            var sql = "INSERT INTO RATINGS VALUES(" + req.session.resource_id + "," + score + ",NULL," + req.session.mYid + ")";
            console.log(sql);
            connection.query(sql, function(err, rows) {

            });
        }

    });
}

method.getResources = function(req,res,cb){
        console.log("Getting Resources");
        var connection = this.connection;
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
                connection.query(sqlstring, function(err, rows_rating) {
                    sum(rows_rating, 0, 0, function(result) {
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
                            console.log(data);
                            return cb(data);
                        });
                    });
                });
            } else {
                data.moreData = false;
                req.session.dbCount = 0;
                return cb(data);
            }
        });
    }
}

method.getComment = function(req,cb){
    console.log("Getting Comments");
    var sql = "SELECT * FROM COMMENTS WHERE RESOURCE_ID = " + req.session.resource_id;
    console.log(sql);
    this.connection.query(sql, function(err, rows) {
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
        return cb(data);
    });
}

method.addComment = function(req){
    var comment = req.body.comment;
    var sql = "INSERT INTO COMMENTS VALUES(" + req.session.resource_id + ",'" + comment + "',NULL," + req.session.mYid + ")";
    console.log(sql);
    this.connection.query(sql, function(err, rows) {
        if (err) {
            throw err;
        }
    });
}

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







module.exports = dataBaseModule;