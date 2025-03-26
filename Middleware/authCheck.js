const jwt = require("jsonwebtoken")
exports.authCheck = async (req,res,next)=>{
    try{
        const headerToken = req.headers.authorization
        console.log(headerToken)
        console.log("hello")
        if(!headerToken){
            return res.status(401).json({
                message:"No Token,authorization"
            })
        }
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}