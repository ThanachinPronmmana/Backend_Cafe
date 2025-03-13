const mongoose = require("mongoose")
const imageSchema = mongoose.Schema({
    asset_id:{
        type:String,
        required:true
    },
    public_id:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    secure_url:{
        type:String,
        required:true
    },
    foodId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Food',
        required:true
    }
},{timestamps:true})
module.exports = mongoose.model("Image",imageSchema)