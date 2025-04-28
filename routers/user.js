const express = require("express")
const router = express.Router()
const {createReservation,
    listReservation,
    listByIdReservation,
    removeReservation,
    listUser,
    userCart,
    getUserCart,
    saveorder,
    getorder,
    removeCart,
    userbyid

} = require("../controllers/user")


// router.post("/reservation",createReservation)
// router.get("/reservation",listReservation)
// router.get("/reservation/:id",listByIdReservation)
// router.delete("/reservation/:id",removeReservation)

router.get("/user",listUser)
router.post("/user",userCart)
router.get("/user/:id",getUserCart)
router.delete("/user/:userId",removeCart)


router.post("/order",saveorder)
// router.get("/order", )

router.get("/profile/:id",userbyid)




module.exports = router