 const jwt = require('jsonwebtoken');

 const authMiddleware = (req,res,next)=>{

    const Auth = req.header('Authorization');
    
    if (!Auth || !Auth.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized Access' });
    }
    const token = Auth.split(" ")[1];

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