const express = require("express")
const router = express.Router()
const {createTable,listTable,removeTable,updateTable} = require("../controllers/table")

router.post("/table",createTable)
router.get("/table",listTable)
router.delete("/table/:id",removeTable)
router.put("/table/:id",updateTable)

module.exports = router