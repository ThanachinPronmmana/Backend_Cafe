const mongoose = require("mongoose");

const ReservationSchema = mongoose.Schema({
  // fk User 
  user_name: {
    type: String,
    required: true
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  tableId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Table", 
    required: true 
  },
  reservation_time: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["Reserved", "Cancel", "Complete"],
    default: "Reserved"
  },
  number:{
    type:Number,
    required:false
  },
  timeId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Time",
    required:true
  }
}, { timestamps: true });

module.exports = mongoose.model("Reservation", ReservationSchema);