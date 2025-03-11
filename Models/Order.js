const mongoose = require("mongoose")
const orderSchema = mongoose.orderSchema({
    //FK ID FOOD
    //FK  Reservation
    
    total_price:{
        type:Number,
        required:flase
    },
    order_status:{
        type:Boolean,
        default:true
    }
},{timestamps:true})
module.exports = mongoose.model("Order",orderSchema)