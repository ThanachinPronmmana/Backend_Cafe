const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const bodyParse = require("body-parser")
const {readdirSync} = require("fs")
const connectDB = require("./Config/db")

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(bodyParse.json({
    limit:"10mb"
}))
connectDB()
readdirSync("./routers").map((a)=>app.use("/api",require("./routers/"+a)))










app.listen(5555,()=>console.log("On port 5555"))