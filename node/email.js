var method = emailModule.prototype;


function emailModule(data_base) {
    this.exec = require('child_process').exec;    
    this.database = data_base;
};

method.sendEmail = function(req){
    this.database.getUserWithEmailandUser(req,function(result){
        for (var i = 0; i < result.length; i++) {  
            this.database.createAndStoreSecureResetPasswordCode(result[i].ID, function(result_code){
                this.exec("bash email.bash " +  result[i].EMAIL + ' ' + result_code, function callback(error, stdout, stderr){ 
                    if(error){
                        console.log("Email Failed to Send");
                    }
                    console.log("Email Sent");
                    });        
             });
        }
    });
}
  
        
module.exports = emailModule;