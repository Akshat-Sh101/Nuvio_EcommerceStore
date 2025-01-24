const express = require('express');
const router = express.Router()
const { registerUser } = require('../controllers/authController');
const { loginUser } = require('../controllers/authController');
const { logoutUser } = require('../controllers/authController');
const { isLoggedin } = require('../middlewares/isLoggedin');
const userModel = require('../models/userModel');
const cartModel = require('../models/cartModel');
const upload = require('../config/multer-config');
const orderModel = require('../models/orderModel');


router.get("/",(req,res)=>{
    res.send("Started the project");
})

router.post("/register",registerUser)

router.post('/login', loginUser)

router.get('/logout', logoutUser)

router.get('/account', isLoggedin ,async (req,res)=>{
    let usercart = await cartModel.findOne({user: req.user._id}).populate('cartItems.product')
    let user = await userModel.findOne({email:req.user.email});
    let orders = await orderModel.find({ user : user._id }).populate('orderItems.product');
    
    let wishlist = usercart.cartItems;
    let success = req.flash("success")
    res.render("account",{user,wishlist,orders,success})
})
// changing profile picture
router.post("/changes",isLoggedin,upload.single("image"),async (req,res)=>{
    let user = await userModel.findOne({email: req.user.email})
    user.picture = req.file.buffer;
    await user.save();

    req.flash("success","Profile Picture Changed Successfully")
    res.redirect('/users/account')
})
// changing personal info
router.post("/updates",isLoggedin,async (req,res)=>{
    let user = await userModel.findOneAndUpdate({_id: req.user._id},{fullname: req.body.name,email:req.body.email,contact:req.body.phnumber})
    await user.save();
    req.flash("success","Details Changed Successfully.")
    res.redirect('/users/account')
})

module.exports = router;