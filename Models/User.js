const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    //fk Order
    //fk Cart
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        default:"Null"
    },
    phone:{
        type:String,
        default:"N/A"
    },
    order_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required:false
    },
    cart_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cart",
        required:false
    }

},{timestamps:true})
module.exports = mongoose.model("User",userSchema)