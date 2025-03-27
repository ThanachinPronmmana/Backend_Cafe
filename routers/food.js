const express = require("express");
const { createFoods,upload} = require("../controllers/food");

const router = express.Router();

router.get("/food",);      // ✅ ดึงข้อมูลอาหารทั้งหมด
router.get("/food/:id",); // ✅ ดึงข้อมูลอาหารตาม ID
router.post("/food", upload.single("images"), createFoods);    // ✅ เพิ่มอาหารใหม่
router.put("/food/:id",);  // ✅ อัปเดตข้อมูลอาหาร
router.delete("/food/:id",); // ✅ ลบอาหาร

module.exports = router;
