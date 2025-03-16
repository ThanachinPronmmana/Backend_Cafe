const mongoose = require("mongoose")
const orderSchema = mongoose.orderSchema({
    //FK ID FOOD
    //FK  Reservation
    //FK Cart
    food_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Food",
        required:true
    },
    cart_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cart",
        required:true
    },
    reservation_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reservation",
        required:true
    },
    total_price:{
        type:Number,
        required:false
    },
    order_status:{
        type:Boolean,
        default:true
    }
},{timestamps:true})
module.exports = mongoose.model("Order",orderSchema)