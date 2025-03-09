const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:false
    },
    phone:{
        type:Number,
        required:false
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:false
    }

},{timestamps:true})
module.exports = mongoose.model("users",userSchema)