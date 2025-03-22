const mongoose = require("mongoose")
const cartSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    reservationId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Reservation", 
        required: false 
    }, 
    items: [
      {
        foodId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Food", 
        required: true 
    },
        quantity: { 
            type: Number, 
            required: true, 
            min: 1 },
        price: { 
            type: Number, 
            required: true 
        } 
      }
    ],
    total_price: { 
        type: Number, 
        required: true, 
        default: 0 
    },
  }, { timestamps: true });
  
  module.exports = mongoose.model("Cart", cartSchema);