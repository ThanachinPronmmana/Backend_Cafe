const mongoose = require("mongoose")
const TableSchema = mongoose.Schema({
    Number:{
        type:Number,
        required:true
    },
    Avalible:{
        type:Boolean,
        default:true
    }
},{timestamps:true})
module.exports = mongoose.model("tables",TableSchema)