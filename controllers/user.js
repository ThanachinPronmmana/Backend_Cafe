const { findOneAndUpdate, findById } = require("../Models/Cart")
const Reservation = require("../Models/Reservation")
const User = require("../Models/User")
const Table = require("../Models/Table")
const Cart = require("../Models/Cart")
const Order = require("../Models/Order")
const Food = require("../Models/Food")
const Time = require("../Models/Time")
//const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

exports.createReservation = async (req, res) => {
    try {
        const { userId, tableId, reservation_time, user_name, reservationId,number} = req.body;

        // ตรวจสอบข้อมูลที่จำเป็น
        if (!userId || !tableId || !reservation_time || !user_name) {
            return res.status(400).json({
                success: false,
                message: "กรุณากรอกข้อมูลให้ครบถ้วน (userId, tableId, reservation_time, user_name)"
            });
        }

        console.log(userId, tableId, reservation_time, user_name)

        let formattedDate;
        if (!isNaN(Date.parse(reservation_time))) {
            formattedDate = new Date(reservation_time);
        } else {
            return res.status(400).json({ message: "รูปแบบวันที่ไม่ถูกต้อง" });
        }

        // ตรวจสอบว่า `formattedDate` เป็นค่าที่ถูกต้อง
        if (isNaN(formattedDate.getTime())) {
            return res.status(400).json({ message: "กรุณากรอกวันที่ที่ถูกต้อง" });
        }
        // สร้างการจองใหม่
        const reservation = new Reservation({
            user_name,
            userId,
            tableId,
            reservation_time: formattedDate,
            status: "Reserved",
            number
        });
        console.log(reservation)

        await reservation.save();

        await User.findByIdAndUpdate(userId, { reservationId: reservation._id })

        await Table.findByIdAndUpdate(tableId, { status: "Reserved" })
        res.status(201).json({
            success: true,
            message: "สร้างการจองสำเร็จ",
            data: reservation
        })
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
        const reservation = await Reservation.findById(id).populate({ path: "userId tableId", select: "name phone number" });
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
        const { userId, quantity, foodId, cartId} = req.body
        console.log(userId)
        const reservationId = req.body.reservationId || null
        const food = await Food.findById(foodId)
        

        let cart = await Cart.findOne({ userId })
        if (!cart) {
            cart = new Cart({
                userId,
                reservationId,
                items: [],
                total_price: 0
            })
        }
        const existingItem = cart.items.find(item => item.foodId.toString() === foodId)
        if (existingItem) {
            existingItem.quantity += quantity
        } else {
            cart.items.push({
                foodId,
                quantity,
                price: food.price
            })
        }
        cart.total_price = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        await cart.save()

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
        console.log("Help")
        const { id } = req.params; // รับ id ของ user จาก URL
        const cart = await Cart.findOne({ userId: id }).populate([
            {
                path: "items.foodId",
                select: "name price"
            },
            {
                path: "reservationId",
                select: "tableId"
            }
        ]);

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        res.json({
            message: "Cart retrieved successfully",
            cartId:cart._id,
            foods: cart.items,
            tableId: cart.reservationId ? cart.reservationId.tableId : null, // ดึง tableId ถ้ามี
            cartTotal: cart.total_price
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
};

exports.saveorder = async (req, res) => {
    try {
        const { userId, cartId,reservationId} = req.body
        const usercart = await Cart.findOne({ _id: cartId, userId }).populate("items.foodId")
        if (!usercart) {
            return res.status(500).json({
                message: "Cart is Empty"
            })
        }
        const total_price = usercart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const newOrder = new Order({
            userId: usercart.userId,
            cartId: usercart._id,
            reservationId: reservationId||usercart.reservationId||null,
            items: usercart.items.map((item) => ({
                foodId: item.foodId._id,
                quantity: item.quantity,
                price: item.price
            })),
            total_price,
            order_status: "Unready"
        })
        await newOrder.save()
        if (cartId) {
            await Cart.findByIdAndDelete(cartId);
        }
        res.json({
            message: "Order placed successfully",
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
// exports.getorder = async (req, res) => {
//     try {
//         const { userId } = req.body;


//         const orders = await Order.find({ userId }).populate("items.foodId");


//         if (orders.length === 0) {
//             return res.status(404).json({
//                 message: "No orders found for this user"
//             });
//         }

//         res.json(orders);
//     } catch (err) {
//         console.error("Error fetching orders:", err);
//         res.status(500).json({
//             message: "Server Error",
//             error: err.message
//         });
//     }
// };
exports.userbyid = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id }).select("email name phone"); // ใช้ findOne()
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user); // ส่งออก Object โดยตรง
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.removeCart = async(req,res)=>{
    try{
        const {userId} = req.params
        await Cart.deleteMany({userId})
        res.send("Delete cart Success")
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}




