var method = dataBaseModule.prototype;

var mysql = require("mysql");


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
                        cb(data);

                    });


                });
            });
        });
    }
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