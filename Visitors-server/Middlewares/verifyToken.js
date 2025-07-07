import jwt from "jsonwebtoken"

const verifyToken = (req,res,next )=>{
    const {token} = req.cookies    
    if(!token){
        return res.status(401).json({success:false,message:"Token required"})
    }

    jwt.verify(token , process.env.JWT_SECRET,(error,decoded)=>{
        if(error){
            return res.status(403).json({success:false,message:"Invalid token or expired"})
        }
        req.admin = decoded 
        // console.log(decoded);
        next()

    })
}
export default verifyToken