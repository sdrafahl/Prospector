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







module.exports = dataBaseModule;