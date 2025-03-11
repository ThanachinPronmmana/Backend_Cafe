const mongoose = require("mongoose")
const connectDB = async ()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/cafe") //ID mongo
        console.log("DB Connect")
    }catch(err){
        console.log(err)
    }
}
module.exports = connectDB