var method = nonDataBaseControler.prototype;

function nonDataBaseControler() {
    
};


method.getSessionData = function(req,res,cb){
    console.log('Getting Session Data');
    if (req.session.loggedIn) {
        var data = {
            loggedIn: req.session.loggedIn,
            id: req.session.mYid,
            user: req.session.user,
            email: req.session.email,
            ext: req.session.imgExt
        };
        return cb(data);
    } else {
        var data = {
            loggedIn: false
        }
        return cb(data);
    }
}

method.sendID = function(req,callBack){
    console.log("Server Recieving Resource ID");
    req.session.resource_id = req.body.id;
    console.log("ID is: " + req.body.id);
    if (req.body.id > 0) { //this may be a problem
        return callBack({ success: "Success", status: 200 });
    }
}


module.exports = nonDataBaseControler;