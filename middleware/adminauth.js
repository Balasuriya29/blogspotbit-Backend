//401 Unauthoried
//403 Forbidden

const jwt = require("jsonwebtoken");
const config = require('config');

module.exports = function (req, res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send("Access Denied! Token Required");

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

        if(!decoded.isAdmin) return res.status(403).send("This is a Forbidden Call for You");
        next();
    } catch (e) {
        res.status(400).send("Invalid Token!!!")
    }

    
}