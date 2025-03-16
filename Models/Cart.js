const mongoose = require("mongoose")
const cartSchema = new mongoose.Schema({
    customer_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    table_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Table", 
        required: false 
    }, 
    items: [
      {
        food_id: { 
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