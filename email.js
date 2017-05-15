var method = emailModule.prototype;


function emailModule() {
var exec = require('child_process').exec;    
};


method.sendEmail = function(email,password){
    exec("bash email.bash " +  email + password, function callback(error, stdout, stderr){
        
        if(error){
            console.log("Failed to send email");
        }
        console.log("Email Sent");
    });

}





module.exports = emailModule;