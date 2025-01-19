const express =require("express");
const router = express.Router()
const { isLoggedin } = require("../middlewares/isLoggedin");
const productModel = require('../models/productModel')

router.get('/',(req,res)=>{
    let error = req.flash("error"); // yha per error ki value nikali hai jo isLoggedin pe set kari this
    res.render('index', {error})
})

router.get('/shop',isLoggedin,async (req,res)=>{
    let products = await productModel.find();
    res.render('shop',{products})
})

module.exports =router;