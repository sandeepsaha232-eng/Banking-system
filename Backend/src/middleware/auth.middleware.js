 const jwt = require('jsonwebtoken');

 const authMiddleware = (req,res,next)=>{

    // support for both the cookies and bearer token for postman 
    const token = req.cookies?.token || req.header('Authorization')?.split(" ")[1];

    if(!token){
        return res.status(401).json({ message: 'Invalid user' });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // user data from the token
        next();
    }catch(err){
        return res.status(401).json({ message: 'Unauthorized Access' });
    }
 }

 module.exports = authMiddleware;