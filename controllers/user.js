const { findOneAndUpdate, findById } = require("../Models/Cart")
const Reservation = require("../Models/Reservation")
const User = require("../Models/User")
const Table = require("../Models/Table")
const Cart = require("../Models/Cart")
const Order = require("../Models/Order")
const Food = require("../Models/Food")


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
// exports.updateReservation = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const reservation = await Reservation.findById(id)
        
//         if(!reservation){
//             return res.status(404).json({message:"Reservation not found"})
//         }
//         const formattedDate = new Date(reservation_time)
//         const { user_name,reservation_time } = req.body
//         const updateReservation = await Reservation.findOneAndUpdate(
//             {_id:id},
//             {user_name,reservation_time:formattedDate},
//             {new:true}
//         )
//         res.json(updateReservation)
        
//         // const updatereservation = await Reservation.findOneAndUpdate(
//         //     { _id: id },  // 
//         //     req.body,
//         //     { new: true }
//         // );

//         // if (!tableId) {
//         //     return res.status(404).json({
//         //         message: "table no found"
//         //     })
//         // }

//         // if (!reservation) {
//         //     return res.status(404).json({
//         //         message: "Reservation not found"
//         //     });
//         // }
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             message: "Server Error"
//         });
//     }
// };
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
        const user = await User.find().populate("order_Id cart_Id")
        res.json(user)
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}
//check userCart
exports.userCart = async(req,res)=>{
    try{
        const { userId } = req.body
        console.log(userId)
        const cart = await Cart.findOne({userId}).populate("items.foodId","quantity")
        if(!cart || cart.items.length === 0 ){
            return res.status(400).json({
                message:"Cart not empty"
            })
        }
        for(const item of cart.items){
            if(!item.foodId || item.quantity > item.foodId.quantity){
                return res.status(400).json({
                    message:`Sorry. Food ${item.foodId.name || "food"} Out`
                })
            }
        }
        //Delete old Cart item 
        await Cart.deleteMany({userId})

        let foods = cart.items.map((item)=>({
            foodId:item.foodId._id,
            quantity:item.quantity,
            price:item.foodId.price
        }))
        let cartTotal = foods.reduce(
            (sum,item)=> sum+item.price * item.quantity,0
        )
        //new cart
        const newCart = new Cart({
            userId,
            items:foods,
            total_price:cartTotal
        }) 
        const creatCart = await newCart.save()
        res.json({
            message:"Cart update successfully",
            creatCart
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}
//แสดง cart user
exports.getUserCart = async (req,res)=>{
    try{
        const cart = await Cart.findOne({
            userId:req.user.id
        }).populate({
            path:"items.foodID",
            select:"name price"
        }).exec()
        res.json({
            foods:cart.items,
            cartTotal:cart.total_price
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}
//ในกรณีที่ตะกร้าว่างเปล่า
exports.emptyCart = async(req,res)=>{
    const cart = await Cart.findOne({userId:req.user.id})


    if(!cart){
        return res.status(400).json({
            message:"Cart not found"
        })
    }
    const result = await Cart.deleteOne({
        userId:req.user.id
    })
}
exports.saveorder = async(req,res)=>{
    try{

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}
exports.getorder = async(req,res)=>{
    try{

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}


