const mongoose = require("mongoose")
const foodSchema = mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },
    quantity:{
        type:String,
        required:true
    },
    count:{
        type:Number,
        required:true
    },
    isAvalible:{
        enum:["Avalible","Unavailable"],
        default:"Avalible"
    },
    cagetory:{
        type:String,
        default:true
    },
    orderId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    }],
    cartId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cart"
    }],
    images:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Image"
    }],
    price:{
        type:Number,
    }

    
},{timestamps:true})
module.exports = mongoose.model("Food",foodSchema)