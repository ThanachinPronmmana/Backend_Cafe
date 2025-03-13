const Reservation = require("../Models/Reservation")
const Table = require("../Models/Table")

exports.createReservation = async(req,res)=>{
    try{
    const {user_name,tableId,reservation_time} = req.body
    //find table id
    const table = await Table.findById(tableId)
    if(!table || table.status !== Available){
        res.status(400).json({
            message:"The table is not Available"
        })
    }
    const newReservation = new Reservation({
        userId,
        tableId,
        reservation_time,
        status: "Booking"
      });
      await newReservation.save()
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}
