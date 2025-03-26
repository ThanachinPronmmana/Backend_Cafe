const express = require("express")
const router = express.Router()
const {createReservation,
    listReservation,
    listByIdReservation,
    removeReservation,
    listUser,
    userCart
} = require("../controllers/user")
const {authCheck} = require("../Middleware/authCheck")

router.post("/reservation",createReservation)
router.get("/reservation",listReservation)
router.get("/reservation/:id",listByIdReservation)
router.delete("/reservation/:id",removeReservation)

router.get("/user",authCheck,listUser)
router.post("/user",userCart)
router.get("/")





module.exports = router