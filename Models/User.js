const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    //fk Order
    //fk Food
    //
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
        default:"Anonymous"
    },
    phone:{
        type:String,
        default:"N/A"
    },

},{timestamps:true})
module.exports = mongoose.model("User",userSchema)