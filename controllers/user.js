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
        const { userId, tableId, reservation_time } = req.body;

        // ตรวจสอบว่ามีข้อมูลครบหรือไม่
        if (!userId || !tableId || !reservation_time) {
            return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }

        // ตรวจสอบว่า User มีอยู่จริงไหม
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "ไม่พบผู้ใช้" });
        }

        // ตรวจสอบว่า Table มีอยู่จริงไหม
        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json({ message: "ไม่พบโต๊ะที่ต้องการจอง" });
        }

        // สร้างการจอง
        const newReservation = new Reservation({
            user_name: user.name, // สมมติว่ามี `name` ใน User Model
            userId,
            tableId,
            reservation_time,
            status: "Reserved"
        });

        await newReservation.save();

        // ตั้งค่าให้ยกเลิกการจองอัตโนมัติหากเลยเวลา 5 นาที
        const cancelTime = new Date(reservation_time).getTime() + 5 * 60 * 1000;
        const now = new Date().getTime();
        const timeRemaining = cancelTime - now;

        if (timeRemaining > 0) {
            setTimeout(async () => {
                const updatedReservation = await Reservation.findById(newReservation._id);
                if (updatedReservation && updatedReservation.status === "Reserved") {
                    updatedReservation.status = "Cancel";
                    await updatedReservation.save();
                    console.log(`Reservation ${newReservation._id} ถูกยกเลิกอัตโนมัติ`);
                }
            }, timeRemaining);
        }

        res.status(201).json({
            message: "สร้างการจองสำเร็จ",
            reservation: newReservation
        });

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
        const reservation = await Reservation.findById(id).populate({path:"userId tableId",select:"name phone number"});

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
        const user = await User.find().select("email name phone reservationId orderId").populate("reservationId")
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
        const { userId,quantity,foodId,reservationId,cartId,} = req.body
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
                reservationId,
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
        const { id } = req.params;  // รับ id จาก URL

        const cart = await Cart.findOne({ _id: id }).populate({
            path: "items.foodId",
            select: "name price"
        });
        
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }
          
        res.json({
            message: "Cart retrieved successfully",
            foods: cart.items,
            cartTotal: cart.total_price
        });
        
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
        // const { reservationId, cartId, foodId, userId } = req.body
        //หา cart ของ user
        // const userCart = await Cart.findOne({ _id: cartId, userId: req.user.id }).populate("items.foodId")
        // if (!userCart || userCart.items.length === 0) {
        //     return res.status(400).json({
        //         message: "Payment amount does not match cart total"
        //     })
        // }
        const {userId,items,cartId,reservationId,order_status} = req.body
        const usercart = await Cart.findOne({_id:cartId,userId}).populate("items.foodId")
        if(!usercart){
            return res.status(500).json({
                message:"Cart is Empty"
            })
        }
        const total_price = usercart.items.reduce((sum,item)=>sum + item.price*item.quantity,0)
        const newOrder = new Order({
            userId,
            cartId,
            reservationId,
            items:usercart.items.map((item)=>({
                foodId:item.foodId._id,
                quantity:item.quantity,
                price:item.price
            })),
            total_price,
            order_status:"Unready"
        })
        await newOrder.save()
        await Cart.findByIdAndDelete(cartId)
        res.json({
            message:"Order placed successfully",
            newOrder
        })
        
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
        const { userId } = req.body;

        
        const orders = await Order.find({ userId }).populate("items.foodId");

        
        if (orders.length === 0) {
            return res.status(404).json({
                message: "No orders found for this user"
            });
        }

        res.json(orders);
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
};



