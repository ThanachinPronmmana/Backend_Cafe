exports.auth = async (req,res,next)=>{
    try{
        const token = req.headers["authtoken"]
        
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}