const Food = require("../Models/Food");
const Image = require("../Models/Image");
const Cart = require("../Models/Cart")
const multer = require("multer")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //โฟลเดอร์สำหรับเก็บรูปภาพ
        cb(null, './images');
    },

    //เปลี่ยนชื่อไฟล์ป้องกันชื่อซ้ำกัน
    filename: function (req, file, cb) {
        cb(null, Date.now() + ".jpg")
    }

})
//เริ่มต้นการ upload
const upload = multer({
    storage: storage
})

exports.upload = upload;

exports.createFoods = async (req, res) => {
    try {

        const { name, quantity, count, cagetory, price, isAvalible, ImagesId } = req.body;

        // ตรวจสอบข้อมูลที่จำเป็น
        if (!name || !quantity || !count || !cagetory || !price) {
            return res.status(400).json({
                message: "กรุณากรอกข้อมูลให้ครบถ้วน"
            });
        }

        // สร้างรายการอาหาร
        const food = new Food({
            name,
            quantity,
            count,
            cagetory,
            price,
            ImagesId: [],
            isAvalible: "Avalible"
        });
        await food.save();

        // ตรวจสอบและบันทึกรูปภาพถ้ามี
        if (req.file) {
            const image = new Image({
                asset_id: req.file.filename,
                public_id: req.file.path,
                url: req.file.path,
                secure_url: req.file.path,
                foodId: food._id
            });
            await image.save();

            // อัปเดต references ของรูปภาพใน Food
            await Food.findByIdAndUpdate(
                food._id,
                { $push: { images: image._id } },
                { new: true }
            );
        }

        res.status(201).json(food);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์",
            error: err.message
        });
    }
};

exports.getAllFoods = async (req, res) => {
    try {
        const foods = await Food.find().populate('images');
        res.json(foods);
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการดึงรายการอาหาร:', err);
        res.status(500).json({
            message: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์",
            error: err.message
        });
    }
};

exports.updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity, count, isAvalible, price } = req.body;

        const updatedFood = await Food.findByIdAndUpdate(
            id,
            { name, quantity, count, isAvalible, price },
            { new: true }
        );
        await Cart.updateMany(
            { "items.foodId": id },
            { $pull: { items: { foodId: id } } }
        )

        if (!updatedFood) {
            return res.status(404).json({ message: "ไม่พบรายการอาหาร" });
        }

        res.json(updatedFood);
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการอัปเดตอาหาร:', err);
        res.status(500).json({
            message: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์",
            error: err.message
        });
    }
};

exports.deleteFood = async (req, res) => {
    try {
        const { id } = req.params;

        // ลบรูปภาพที่เชื่อมโยง
        await Image.deleteMany({ foodId: id });

        // ลบรายการอาหาร
        const deletedFood = await Food.findByIdAndDelete(id);
        await Cart.updateMany(
            { "items.foodId": id }, // หา cart ที่มี foodId นี้
            { $pull: { items: { foodId: id } } } // ลบ foodId ใน array items
        );
        if (!deletedFood) {
            return res.status(404).json({ message: "ไม่พบรายการอาหาร" });
        }

        res.json({
            message: "ลบรายการอาหารสำเร็จ",
            deletedFood
        });
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการลบอาหาร:', err);
        res.status(500).json({
            message: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์",
            error: err.message
        });
    }
};

