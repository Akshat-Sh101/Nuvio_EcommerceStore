const express = require('express');
const router = express.Router()
const { isLoggedin } = require("../middlewares/isLoggedin");
const productModel = require('../models/productModel');
const userModel = require("../models/userModel");
const cartModel = require("../models/cartModel");
const ownerModel = require('../models/ownerModel');



router.get('/addtocart/:productid', isLoggedin, async (req, res) => {
    try {
        // Fetch the logged-in user
        const user = await userModel.findOne({ email: req.user.email });

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect('/login');
        }

        // Fetch the user's cart
        let usercart = await cartModel.findOne({ user: user._id })

        // Fetch the product being added to the cart
        const product = await productModel.findById(req.params.productid);
        if (!product) {
            req.flash("error", "Product not found.");
            return res.redirect('/shop');
        }

        // Create a new cart if the user doesn't have one
        if (!usercart) {
            usercart = new cartModel({ user: user._id, cartItems: [] });
            await usercart.save();
            user.cart = usercart._id; // Associate the cart with the user
            await user.save();
        }

        // Check if the product is already in the cart
        const itemIndex = usercart.cartItems.findIndex(
            (item) => item.product.toString() === req.params.productid
        );

        if (itemIndex > -1) {
            // If product exists in the cart, increment the quantity
            usercart.cartItems[itemIndex].quantity += 1;
            // product.mostviewed++;
        } else {
            // If product is not in the cart, add it
            usercart.cartItems.push({ product: product._id, quantity: 1 });
        }
        
        product.mostviewed++;

        // Save the updated cart
        await usercart.save();
        await product.save();

        req.flash("success", "Product successfully added to cart.");
        res.redirect("/shop");
    } catch (error) {
        console.error("Error adding to cart:", error);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/shop");
    }
});

router.get("/cart",isLoggedin,async (req,res)=>{
    let usercart = await cartModel.findOne({user: req.user._id}).populate("cartItems.product")

    let success = req.flash("success")
    let error = req.flash("error")
    let ordersuccess = req.flash("ordersuccess")

    res.render("cart", {usercart,success,error,ordersuccess})
})

router.get('/deletefromcart/:productid', isLoggedin, async (req, res) => {
    try {
        // Fetch the logged-in user
        const user = await userModel.findOne({ email: req.user.email }).populate('cart');
        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect('/login');
        }

        // Ensure the user has a cart
        if (!user.cart) {
            req.flash("error", "Cart not found.");
            return res.redirect('/carts/cart');
        }

        // Fetch the user's cart
        const usercart = await cartModel.findById(user.cart);
        if (!usercart) {
            req.flash("error", "Cart data not found.");
            return res.redirect('/carts/cart');
        }

        // Find the product in the cart
        const productIndex = usercart.cartItems.findIndex(
            (item) => item.product.toString() === req.params.productid
        );

        if (productIndex === -1) {
            req.flash("error", "Product not found in cart.");
            return res.redirect('/carts/cart');
        }

        // Remove the product from the cart
        usercart.cartItems.splice(productIndex, 1);

        // Save the updated cart
        await usercart.save();

        req.flash("success", "Product successfully removed from cart.");
        res.redirect('/carts/cart');
    } catch (error) {
        console.error("Error removing product from cart:", error);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect('/carts/cart');
    }
});

router.get('/increase/:productid',isLoggedin,async (req,res)=>{
    let usercart = await cartModel.findOne({user:req.user._id})
    usercart.cartItems.forEach((products)=>{
        if(products.product.toString() === req.params.productid){
            products.quantity = products.quantity+1;
        }
    })
    await usercart.save();

    res.redirect("/carts/cart");
})

router.get('/decrease/:productid',isLoggedin,async (req,res)=>{
    let usercart = await cartModel.findOne({user:req.user._id})

    usercart.cartItems.forEach((products)=>{
        if(products.product.toString() === req.params.productid && products.quantity > 1){
            products.quantity = products.quantity-1;
        }
    })
    await usercart.save();

    res.redirect("/carts/cart");
})

module.exports =router;