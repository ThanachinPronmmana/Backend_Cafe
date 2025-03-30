const mongoose = require("mongoose");
const Reservation = require("./Reservation");

const tableSchema = mongoose.Schema({
    number: { 
        type: Number, 
        required: true, 
        unique: true 
    },
    seats: { 
        type: Number, 
        required: true 
    },
    status: { type: String, 
        enum: ["Available", "Reserved"], 
        default: "Available"
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:false
    }
}, { timestamps: true });


tableSchema.pre("findOneAndDelete", async function (next) {
    const tableId = this.getQuery()._id;
    await Reservation.deleteMany({ tableId });
    next();
});

module.exports = mongoose.model("Table", tableSchema);
