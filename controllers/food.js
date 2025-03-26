const Food = require("../Models/Food")

exports.createFood = async (req,res)=>{
    try{
        const {name,quantity,count,isAvalible,cagetory,price} = req.body
        const food = new Food({
            name,
            quantity,
            count,
            cagetory,
            price,
            isAvalible:"Avalible"
        })
        await food.save()
        res.json(food)
    }catch(err){
        consol.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}