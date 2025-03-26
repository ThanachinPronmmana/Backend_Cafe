const express = require("express")
const router = express.Router()
const {createFood} = require("../controllers/food")

router.get("/food",)
router.get("/food/:id",)
router.post("/food",createFood)
router.put("/food/:id",)
router.delete("/food/:id",)

module.exports = router