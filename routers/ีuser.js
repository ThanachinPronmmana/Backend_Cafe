const express = require("express")
const router = express.Router()
const {createReservation,
    listReservation,
    listByIdReservation,
    removeReservation,
    listUser
} = require("../controllers/user")

router.post("/reservation",createReservation)
router.get("/reservation",listReservation)
router.get("/reservation/:id",listByIdReservation)
router.delete("/reservation/:id",removeReservation)

router.get("/user",listUser)






module.exports = router