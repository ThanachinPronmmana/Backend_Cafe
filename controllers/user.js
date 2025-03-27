const { findOneAndUpdate, findById } = require("../Models/Cart")
const Reservation = require("../Models/Reservation")
const User = require("../Models/User")
const Table = require("../Models/Table")
const Cart = require("../Models/Cart")
const Order = require("../Models/Order")
const Food = require("../Models/Food")
//const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

exports.createReservation = async (req, res) => {
    try {
        const { userId, tableId, reservation_time, user_name } = req.body;

        // ตรวจสอบว่ามี userId อยู่ในระบบหรือไม่
        const checkuserId = await User.findById(userId);
        if (!checkuserId) {
            return res.status(400).json({ message: "User not found" });
        }

        // ตรวจสอบว่าผู้ใช้มีการจองอยู่แล้วหรือไม่
        const havereservation = await Reservation.findOne({ userId, status: "Reserved" });
        if (havereservation) {
            return res.status(400).json({ message: "You already have a reservation" });
        }

        // ตรวจสอบว่าโต๊ะว่างหรือไม่
        const table = await Table.findById(tableId);
        if (!table || table.status !== "Available") {
            return res.status(400).json({ message: "The table is not Available" });
        }


        // แปลงเวลาการจอง
        const formattedDate = new Date(reservation_time);
        console.log(formattedDate)

        // สร้างการจองใหม่
        const newReservation = new Reservation({
            user_name,
            userId,
            tableId,
            reservation_time: formattedDate,
            status: "Reserved"
        });
        await newReservation.save();
        //อัปเดต reservationId ของ User
        await User.findByIdAndUpdate(userId, { reservationId: newReservation._id })
        
        // อัปเดตสถานะโต๊ะเป็น Reserved
        await Table.findByIdAndUpdate(tableId, { status: "Reserved" });

        // ตั้งเวลาให้ Reservation ถูกยกเลิกหากผู้ใช้ไม่มาตรงเวลา + 15 นาที
        const cancelTime = new Date(formattedDate.getTime() + 15 * 60 * 1000); // บวก 15 นาที

        setTimeout(async () => {
            const now = new Date()
            const reservation = await Reservation.findById(newReservation._id);
            console.log("Current time (now):", now);
            console.log("Reservation time (cancelTime):", cancelTime);
            if (reservation && reservation.status === "Reserved" && now >= cancelTime) {
                console.log(`Cancelling Reservation ${newReservation._id}...`);
                await Reservation.findByIdAndDelete(newReservation._id);
                await User.findByIdAndUpdate(userId, { reservationId: null });
                await Table.findByIdAndUpdate(tableId, { status: "Available" });
                console.log(`Reservation ${newReservation._id} has been canceled due to no-show.`);
            } else {
                console.log(`Reservation ${newReservation._id} not canceled.`);
            }
        }, 15 * 60 * 1000);


        res.json({ message: "Create Reservation success", reservation: newReservation });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.listReservation = async (req, res) => {
    try {

        const listReservation = await Reservation.find()
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
exports.removeReservation = async (req, res) => {
    try {
        const { id } = req.params
        const reservation = await Reservation.findById(id)
        if (!reservation) {
            return res.status(400).json({
                message: "Reservation not found"
            })
        }
        const { tableId } = reservation
        await Reservation.findByIdAndDelete(id)
        if (tableId) {
            await Table.findByIdAndUpdate(tableId, { status: "Available" })
        }
        res.send("Reservation deleted successfully")
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}
exports.listUser = async (req, res) => {
    try {
        const user = await User.find().select("email name phone reservationId").populate("reservationId", "")
        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}
//check userCart
exports.userCart = async (req, res) => {
    try {
        const { userId,quantity,foodId} = req.body
        console.log(userId)
        const food = await Food.findById(foodId)
        // const user = await User.findById(userId)
        // if (!user) {
        //     return res.status(400).json({
        //         message: "User not Found"
        //     })
        // }
        //ค้นหาตะกร้าผู้ใช้

        let cart = await Cart.findOne({userId})
        if(!cart){
            cart = new  Cart({
                userId,
                items:[],
                total_price:0
            })
        }
        const existingItem = cart.items.find(item => item.foodId.toString()===foodId)
        if(existingItem){
            existingItem.quantity += quantity
        }else{
            cart.items.push({
                foodId,
                quantity,
                price:food.price
            })
        }
        cart.total_price = cart.items.reduce((sum,item)=>sum+item.price*item.quantity,0)
        await cart.save()
        //const cart = await Cart.findOne({ userId }).populate("items.foodId","name quantity price")
        // if (!cart || cart.items.length === 0) {
        //     return res.status(400).json({
        //         message: "Cart is empty"
        //     })
        // }
        // const outofstock = cart.items.find(item =>
        //     !item.foodId || item.quantity > item.foodId.quantity
        // )
        // if (outofstock) {
        //     return res, statas(400).json({
        //         message: `Sorry. Food ${outofstock.foodId.name || "food"} Out`
        //     })
        // }
        // for(const item of cart.items){
        //     if(!item.foodId || item.quantity > item.foodId.quantity){
        //         return res.status(400).json({
        //             message:`Sorry. Food ${item.foodId.name || "food"} Out`
        //         })
        //     }
        // }
        //Delete old Cart item 
        // await Cart.deleteMany({ userId })

        // let foods = cart.items.map((item) => ({
        //     foodId: item.foodId._id,
        //     quantity: item.quantity,
        //     price: item.foodId.price
        // }))
        // let cartTotal = foods.reduce(
        //     (sum, item) => sum + item.price * item.quantity, 0
        // )
        // //new cart
        // const newCart = new Cart({
        //     items: foods,
        //     total_price: cartTotal,
        //     userId: userId,
        // })
        // const creatCart = await newCart.save()
        res.json({
            message: "Item add to cart",
            cart
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}
//แสดง cart user
exports.getUserCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.user.id
        }).populate({
            path: "items.foodID",
            select: "name price"
        }).exec()
        res.json({
            foods: cart.items,
            cartTotal: cart.total_price
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}
//ในกรณีที่ตะกร้าว่างเปล่า
// exports.emptyCart = async (req, res) => {
//     try {
//         const cart = await Cart.findOne({ userId: req.user.id })
//         if (!cart) {
//             return res.status(400).json({
//                 message: "Cart not found"
//             })
//         }
//         const result = await Cart.deleteMany({
//             userId: req.user.id
//         })
//         res.json({
//             message: "Cart Empty Success",
//             deleteCount: result.count
//         })
//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).json({
//             message: "Server Error"
//         })
//     }
// }
exports.saveorder = async (req, res) => {
    try {
        const { reservationId, cartId, foodId, userId } = req.body
        //หา cart ของ user
        const userCart = await Cart.findOne({ _id: cartId, userId: req.user.id }).populate("items.foodId")
        if (!userCart || userCart.items.length === 0) {
            return res.status(400).json({
                message: "Payment amount does not match cart total"
            })
        }
        //ตรวจสอบ tatal_price  ตรงกับยอดชำระ

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}
exports.getorder = async (req, res) => {
    try {

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}


