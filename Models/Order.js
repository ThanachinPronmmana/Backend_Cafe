const mongoose = require("mongoose")
const orderSchema = mongoose.orderSchema({
    //FK ID FOOD
    //FK  Reservation
    //FK Cart
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
        enum:["Readly","Unready"],
        default:"Readly"
    }
},{timestamps:true})
module.exports = mongoose.model("Order",orderSchema)