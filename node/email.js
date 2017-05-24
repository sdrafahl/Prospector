var method = emailModule.prototype;


function emailModule(conn) {
    this.exec = require('child_process').exec;    
    this.connection = conn;
};


method.sendEmail = function(req){
    var input = req.body.email_usr;
    var str = "SELECT * FROM ACCOUNTS WHERE USER = " + input + " OR " + input + " = EMAIL";
    console.log(str);
    this.connection.query(str, function(err, rows) {
        for (var i = 0; i < rows.length; i++) {
            var email = rows[i].EMAIL;
            var password = rows[i].PASS;
            this.exec("bash email.bash " +  email + password, function callback(error, stdout, stderr){        
                if(error){
                    console.log("Failed to send email");
                }
                console.log("Email Sent");
            });      
        }
   });
}

module.exports = emailModule;