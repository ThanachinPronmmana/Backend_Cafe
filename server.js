const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const bodyParse = require("body-parser")
const {readdirSync} = require("fs")

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(bodyParse.json({
    limit:"10mb"
}))

readdirSync("./router").map((a)=>app.use("/api",require("./routers/"+a)))
















app.listen(8000,()=>console.log("On port 8000"))