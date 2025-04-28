const mongoose = require("mongoose")
const timeSchema = mongoose.Schema({
    time:{
        type:String,
        required:false
    },
    reservationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reservation"
    },
},{timestamps:true})
module.exports = mongoose.model("Time",timeSchema)