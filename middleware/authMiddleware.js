const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    const {token} = req.cookies;
 
   if(!token){
        return res.json({success: false, message: 'Login Again'});
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if(tokenDecode.id){
            req.body.userId = tokenDecode.id
        }else{
            return res.json({success: false, message: 'Not Authorized Login Again'});   
        }

        next();

    } catch (error) {
        return res.json({success: false, message: error.message});
        
    }
}

module.exports = authMiddleware;