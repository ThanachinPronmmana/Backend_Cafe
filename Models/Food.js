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
        type:Boolean,
        default:true
    },
    cagetory:{
        type:String,
        default:true
    },
    orderfood:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    }],
    cartfood:[{
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