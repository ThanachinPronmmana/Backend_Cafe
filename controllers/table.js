const Table = require("../Models/Table")
const Reservation = require("../Models/Reservation")
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
exports.listTable = async(req,res)=>{
    try{
        const tables = await Table.find()
        res.json(tables)
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}
exports.removeTable = async(req,res)=>{
    try{
        const {id} = req.params
        await Reservation.deleteMany({tableId:id})
        await Table.findByIdAndDelete({_id:id})
        res.send("Delete Success")
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}
exports.updateTable = async(req,res)=>{
    try{
        const {id} = req.params
        await Reservation.deleteMany({tableId:id})
        const table = await Table.findById(id)
        if(!table){
            return res.status(404).json({ message:"Table not found" })
        }
        const {number,seats,status} = req.body
        const updatetable = await Table.findByIdAndUpdate(
            {_id:id},
            {number,seats,status},
            {new:true}
        )
        res.json(updatetable)
        
        
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })


    }
}
// exports.listtableBy = async(req,res)=>{
//     try{
//         const {userId} = req.params
//         const table = await Table.find({userId:userId}).populate("number")
//         res.json({
//             table
//         })
//     }catch(err){
//         console.log(err)
//         res.status(500).json({
//             message:"Server Error"
//         })
//     }
// }