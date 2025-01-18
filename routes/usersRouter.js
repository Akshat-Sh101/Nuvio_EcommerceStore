const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const {registerSchema} = require('../models/registerModel')

router.get("/",(req,res)=>{
    res.send("Started the project");
})

router.post("/register",async (req,res)=>{
    try{
        // Validate incoming data
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        let {email,password,fullname} = req.body;

        // Check for Existing User
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) return res.status(400).json({ message: 'User already exists.' });

        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,async (err,hash)=>{
                if(err) return res.send(err.message)
                else{
                    let user = await userModel.create({
                        fullname,
                        email,
                        password: hash,
                    })
                    let token = jwt.sign({email,id: user._id},"secret");
                    res.cookie("token", token)
                }
            })
        })
    }
    catch(err){
        res.send(err.message)
    }
})

module.exports = router;