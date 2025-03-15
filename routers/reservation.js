const express = require("express")
const router = express.Router()
const {createReservation,createTable,listReservation} = require("../controllers/reservation")

router.post("/createTable",createTable)


router.post("/reservation",createReservation)
router.get("/reservation",listReservation)
router.get("/reservation/:id",)
router.put("/reservation/:id",)
router.delete("/reservation/:id",)

module.exports = router