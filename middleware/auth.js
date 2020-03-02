const jwt = require('jsonwebtoken');


module.exports = async function (req, res, next){
    //get the token from header
    const token = req.header('x-auth-token');

    //check if not token
    if(!token){
        res.status(401).json({msg:'no token, authorization denied'});
    }

    //verify token
    try{
        const decoded = await jwt.verify(token,'secretKey');

        req.user = decoded.user;

        next();
    }catch(err){
        res.status(401).json({msg:'token is not valid '});
    }
}