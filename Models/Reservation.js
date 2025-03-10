const mongoose = require("mongoose")
const ReservationSchema = mongoose.Schema({
    //fk User 
    //fk table




},{timestamps:true})
module.export = mongoose.model("Reservation",ReservationSchema)