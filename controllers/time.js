const Reservation = require("../Models/Reservation")
const Time = require("../Models/Time")
exports.setTime = async(req,res)=>{
    try{
        const {time} = req.body
        const newTime = new Time({
            time,
        })
        await newTime.save()
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}