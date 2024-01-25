export function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    next();
}

export function checkNotAuthenticated(req, res, next) {
    if (req.isUnauthenticated()) {
        var hashed_version = Buffer.from('ec452bab86133ef6711090c7b4a74e06f3c202e0e7b339ffdb10a6f76c745620').toString('base64');
        return res.redirect(`/?login_required=true&uml=${hashed_version}`);
    }
    next();
}

export function checkIfNotAdmin (req,res,next){

    if(res.userType == "1"){

    }
    return;
}

export function clientOnlyPage (req,res,next){
    return;
}