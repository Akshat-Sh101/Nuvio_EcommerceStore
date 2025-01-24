const express =require("express");
const router = express.Router()
const { isLoggedin } = require("../middlewares/isLoggedin");
const productModel = require('../models/productModel');
const userModel = require("../models/userModel");

router.get('/',(req,res)=>{
    let error = req.flash("error"); // yha per error ki value nikali hai jo isLoggedin pe set kari this
    let success = req.flash("success")
    res.render('index', {error,success, loggedin: false})
})

router.get('/shop',isLoggedin,async (req,res)=>{
    let products = await productModel.find();
    let success = req.flash("success")
    res.render('shop',{products,success})
})
module.exports =router;