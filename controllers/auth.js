const User = require("../Models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
exports.register = async(req,res)=>{
    try{
        const {email,password,name,phone} = req.body
        
        
        if(!email){
            return res.status(400).json({
                message:'Email is required!!!'
            })
        }
        if(!password){
            return res.status(400).json({
                message:"Password is required!!!"
            })
        }
        var user = await User.findOne({email})
        console.log(user)
        if(user){
            return res.status(400).json({
                message:"Email Already Exists!!!"
            })
        }
        const salt = await bcrypt.genSalt(10)
        console.log(salt)
        user = new User({
            email,
            password,
            name,
            phone
        })
        console.log(user)
        user.password = await bcrypt.hash(password,salt)
        console.log(user.password)
        await user.save()
        // const hashPassword = await bcrypt.hash(password,10)
        // const newUser = new User({
        //     _email:email,
        //     _password:hashPassword,
        //     _name:name,
        //     _phone:phone
        // })
        // console.log("New User Object before save:", newUser);
        // await newUser.save()
        // console.log("Saved User:", newUser);
         res.send("Register Success")
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server error"
        })
    }
}
exports.login = async(req,res)=>{
    try{
        const {email,password} = req.body
        var user = await User.findOneAndUpdate({
            email
        },{new:true})
        if(user){
            const isMatch = await bcrypt.compare(password,user.password)
            if(!isMatch){
                return res.status(400).json({
                    message:"Password Invalid!!!"
                })
            }
        }
        res.send("Hello")
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server error"
        })
    }
}