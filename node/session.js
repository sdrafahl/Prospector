var method = nonDataBaseModule.prototype;

function nonDataBaseModule() {
    
};


method.getSessionData = function(req,res,cb){
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


module.exports = nonDataBaseModule;