const { findOneAndUpdate, findById } = require("../Models/Cart")
const Reservation = require("../Models/Reservation")
const User = require("../Models/User")
const Table = require("../Models/Table")



exports.createReservation = async (req, res) => {
    try {
        const { userId, tableId, reservation_time, user_name } = req.body
        //find table id
        const formattedDate = new Date(reservation_time)
        const table = await Table.findById(tableId)
        if (!table || table.status !== "Available") {
            return res.status(404).json({
                message: "The table is not Available"
            })
        }

        const newReservation = new Reservation({
            user_name,
            userId,
            tableId,
            reservation_time:formattedDate,
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
exports.listReservation = async (req, res) => {
    try {

        const listReservation = await Reservation.find().populate("userId tableId")
        res.json(listReservation)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}
exports.listByIdReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findById(id).populate("userId tableId");

        if (!reservation) {
            return res.status(404).json({
                message: "Reservation not found"
            });
        }

        res.json(reservation);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
};
exports.updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findById(id)
        const formattedDate = new Date(reservation_time)
        if(!reservation){
            return res.status(404).json({message:"Reservation not found"})
        }
        const { user_name,reservation_time } = req.body
        const updateReservation = await Reservation.findOneAndUpdate(
            {_id:id},
            {user_name,reservation_time:formattedDate},
            {new:true}
        )
        res.json(updateReservation)
        
        // const updatereservation = await Reservation.findOneAndUpdate(
        //     { _id: id },  // 
        //     req.body,
        //     { new: true }
        // );

        // if (!tableId) {
        //     return res.status(404).json({
        //         message: "table no found"
        //     })
        // }

        // if (!reservation) {
        //     return res.status(404).json({
        //         message: "Reservation not found"
        //     });
        // }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
};
exports.removeReservation = async(req,res)=>{
    try{
        const{id} = req.params
        const reservation = await Reservation.findById(id)
        if(!reservation){
            return res.status(404).json({
                message:"Reservation not found"
            })
        }
        const {tableId} = reservation
        await Reservation.findByIdAndDelete(id)
        if(tableId){
            await Table.findByIdAndUpdate(tableId,{status:"Available"})
        }
        res.send("Reservation deleted successfully")
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}
exports.listUser = async(req,res)=>{
    try{
        
        const user = await User.find().select("name phone").populate("order_Id cart_Id")
        res.json(user)
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}


