const { findOneAndUpdate } = require("../Models/Cart")
const Reservation = require("../Models/Reservation")
const Table = require("../Models/Table")
exports.createTable = async (req, res) => {
    try {
        const { number, seats, status } = req.body
        const createTable = new Table({
            number,
            seats,
            status,
        })

        await createTable.save()
        res.send("Create table Succeed")
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}
exports.createReservation = async (req, res) => {
    try {
        const { userId, tableId, reservation_time, user_name } = req.body
        //find table id
        const table = await Table.findById(tableId)
        if (!table || table.status !== "Available") {
            res.status(400).json({
                message: "The table is not Available"
            })
        }

        const newReservation = new Reservation({
            user_name,
            userId,
            tableId,
            reservation_time,
            status: "Reserved"
        });
        await newReservation.save()


        await Table.findByIdAndUpdate(tableId, { status: "Reserved" })
        res.send("Create Reservation success")

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}
exports.listReservation = async(req,res)=>{
    try{
        // const listReservation = await Reservation.find().populate("userId tableId")
        // console.log(listReservation)
        // res.json(listReservation)
        const listReservation = await Reservation.find().populate("userId tableId")
        res.json(listReservation)
        
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}
exports.listByIdReservation = async(req,res)=>{
    try{
        
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}
