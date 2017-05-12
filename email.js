var method = emailModule.prototype;


function emailModule() {
var exec = require('child_process').exec;    
};


method.sendEmail = function(email,password,cb){
    exec("bash email.bash " +  email + password, function callback(error, stdout, stderr){
        console.log("Email Sent");
        if(error){
            console.log("Failed to send email");
        }
    });

}





module.exports = emailModule;