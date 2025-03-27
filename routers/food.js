const express = require("express");
const { createFoods,upload,getAllFoods,updateFood,deleteFood} = require("../controllers/food");

const router = express.Router();

router.get("/food",getAllFoods);      //  ดึงข้อมูลอาหารทั้งหมด
router.get("/food/:id",); //  ดึงข้อมูลอาหารตาม ID
router.post("/food", upload.single("images"), createFoods);    //  เพิ่มอาหารใหม่
router.put("/food/:id",updateFood);  //  อัปเดตข้อมูลอาหาร
router.delete("/food/:id",deleteFood); //  ลบอาหาร



module.exports = router;
