const jwt=require('jsonwebtoken');
const SECRET_KEY="mySecretKey";

module.exports=(req,res,next)=>{
    try {
        const token=req.headers.authorization;

        if(!token){
            return res.status(401).json({message:"Access Denied — No Token Provided"});
        }

        const decoded=jwt.verify(token,SECRET_KEY);
        req.user=decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({message:"Invalid or Expired Token"}); 
    }
};