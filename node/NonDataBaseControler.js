var method = nonDataBaseControler.prototype;

function nonDataBaseControler(session) {
  this.session = session;
};

method.getSessionData = function(req,res,cb){
    var session = this.session;
    console.log('Getting Session Data');
    if (this.session.loggedIn) {
        var data = {
            loggedIn: session.loggedIn,
            id: session.mYid,
            user: session.user,
            email: session.email,
            ext: session.imgExt
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
    this.session.resource_id = req.body.id;
    console.log("ID is: " + req.body.id);
    if (req.body.id > 0) { //this may be a problem
        return callBack({ success: "Success", status: 200 });
    }
}

module.exports = nonDataBaseControler;
