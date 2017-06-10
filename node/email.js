var method = emailModule.prototype;


function emailModule(data_base) {
    this.exec = require('child_process').exec;    
    this.database = data_base;
};

method.sendEmail = function(req){
    this.database.getUserWithEmailandUser(req,function(result){
        for (var i = 0; i < result.length; i++) {  
            var email = result[i].EMAIL;
            var password = result[i].PASS;
            this.exec("bash email.bash " +  email + password, function callback(error, stdout, stderr){ 
               if(error){
                   console.log("Email Failed to Send");
               }
               console.log("Email Sent");
            });
        }
    });
}
  
        
module.exports = emailModule;