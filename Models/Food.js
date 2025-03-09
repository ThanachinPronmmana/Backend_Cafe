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
    price:{
        type:Number,
        required:true
    },
    isAvalible:{
        type:Boolean,
        default:true
    }
},{timestamps:true})
module.exports = mongoose.model("foods",foodSchema)