const express = require('express');
const router = express.Router()
const { isLoggedin } = require("../middlewares/isLoggedin");
const productModel = require('../models/productModel');
const userModel = require("../models/userModel");
const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");


router.post("/order",isLoggedin,async (req,res)=>{
    let user = await userModel.findOne({email:req.user.email})
    let usercart = await cartModel.findOne({user: user._id})
    let {totalamount,totaldiscount,address} = req.body;
    let allitems = usercart.cartItems;

    let userorder = await orderModel.create({
        user: usercart.user,
        orderItems: allitems,
        totalAmount: totalamount,
        address:address,
        totalDiscount:totaldiscount
    })
    // await usercart.findOneAndUpdate({user: usercart.user},{cartItems:[],updatedAt: Date.now});
    usercart.cartItems = []
    await usercart.save()
    req.flash("ordersuccess","order placed.")


    res.redirect("/carts/cart")
})


module.exports =router;