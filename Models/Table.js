const mongoose = require("mongoose")
const TableSchema = mongoose.Schema({
    number:{
        type:Number,
        required:true,
        unique:true
    },
    seats:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true})
module.exports = mongoose.model("Table",TableSchema)