const express = require("express")
const router = express.Router()
const {createTable,listTable,removeTable,updateTable,listtableBy} = require("../controllers/table")

router.post("/table",createTable)
router.get("/table",listTable)
router.delete("/table/:id",removeTable)
router.put("/table/:id",updateTable)

//router.get("/table/:userId",listtableBy)
module.exports = router