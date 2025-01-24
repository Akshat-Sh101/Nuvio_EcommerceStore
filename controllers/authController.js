const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const cartModel = require('../models/cartModel')

const {registerSchema} = require('../models/registerModel')
const { generateToken } = require('../utils/generateToken')

let registerUser = async (req,res)=>{
    try{
        // Validate incoming data
        const { error } = registerSchema.validate(req.body);
        if (error){
            req.flash("error","Email or Password incorrect...")
            return res.redirect('/')
        }

        let {email,password,fullname} = req.body;

        // Check for Existing User
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            req.flash("error","User already have an account, please login.")
            return res.redirect('/')
        }
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,async (err,hash)=>{
                if(err) return res.send(err.message)
                else{
                    let user = await userModel.create({
                        fullname,
                        email,
                        password: hash,
                    })
                    let token = generateToken(user)
                    res.cookie("token", token)
                    let usercart = await cartModel.create({
                        user:user._id,
                        cartItems: [],
                    })
                    user.cart = usercart._id;
                    await user.save()
                    req.flash("success","User Created Successfully...")
                    return res.redirect('/')
                }
            })
        })
    }
    catch(err){
        res.send(err.message)
    }
}


let loginUser = async (req,res)=>{
    let {email,password} = req.body;
    
    let user = await userModel.findOne({email : email})
    if(!user) {
        req.flash("error","Email or Password incorrect...")
        return res.redirect('/')
    }
    
    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            let token = generateToken(user);
            res.cookie('token',token);
            res.redirect("/shop")
        }
        else{
            req.flash("error","Email or Password incorrect...")
            return res.redirect('/')
        }
    })
}

let logoutUser = (req,res)=>{
    res.cookie("token","");
    return res.redirect("/")
}

module.exports.registerUser = registerUser ;
module.exports.loginUser = loginUser;
module.exports.logoutUser = logoutUser;
