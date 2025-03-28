const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        required: true
    },
    reservationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reservation",
        required: false
    },
    order_status: {
        type: String,
        enum: ["Ready", "Unready"],
        default: "Unready"
    },
    total_price: {  // เปลี่ยนชื่อจาก cartTotal เป็น total_price
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
