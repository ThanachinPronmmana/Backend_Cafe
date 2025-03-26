const mongoose = require("mongoose")
const orderSchema = mongoose.Schema({
    //FK ID FOOD
    //FK  Reservation
    //FK Cart
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    foodId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Food",
        required:true
    },
    cartId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cart",
        required:true
    },
    reservationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reservation",
        required:true
    },
    total_price:{
        type:Number,
        required:false
    },
    order_status:{
        type:String,
        enum:["Ready","Unready"],
        default:"Ready"
    },
    
},{timestamps:true})
module.exports = mongoose.model("Order",orderSchema)