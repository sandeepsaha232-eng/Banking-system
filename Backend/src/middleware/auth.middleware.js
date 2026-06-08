 const jwt = require('jsonwebtoken');

 const authMiddleware = (req,res,next)=>{

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message: 'Invalid user' });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({ message: 'Unauthorized Access' });
    }
 }

 module.exports = authMiddleware;