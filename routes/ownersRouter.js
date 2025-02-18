const express = require('express')
const router = express.Router()
const ownerModel = require("../models/ownerModel");
const productModel = require('../models/productModel');

if(process.env.NODE_ENV === "development"){
    router.post("/create",async (req,res)=>{
        // Only One owner allowed .....
        let owners = await ownerModel.find();
        if(owners.length > 0){
            return res.status(500).send("You don't have permission to create a new OWNER...")
        }

        let {fullname,email,password} = req.body;
        
        let createdOwner = await ownerModel.create({
            fullname : fullname,
            email: email,
            password: password,
        })
        res.status(201).send(createdOwner);
    })
}
router.get("/admin",(req,res)=>{
    let success = req.flash("success")
    let error = req.flash("error")
    res.render("createproducts",{success,error});
})

router.get("/admin",(req,res)=>{
    let success = req.flash("success")
    let error = req.flash("error")
    res.render("createproducts",{success,error});
})

router.get('/all',async (req,res)=>{
    let owner = await ownerModel.findOne({}).populate('products')
    products = owner.products;
    let success = req.flash("success");
    res.render('allcreatedproducts',{products,success})
})

router.get('/update/:productid',async (req,res)=>{
    let product = await productModel.findOne({_id: req.params.productid})
    
    res.render('updateproduct',{product})
})

router.post('/set/:productid',async (req,res)=>{
    let product = await productModel.findOne({_id: req.params.productid})
    let {name , price,discount,bgcolor,panelcolor,textcolor,dynamicdiscount,minPrice} = req.body;

    product.name = name;
    product.price = price;
    
    product.panelcolor = panelcolor;
    product.bgcolor = bgcolor;
    product.textcolor = textcolor;
    product.minPrice = minPrice;

    if(dynamicdiscount === "true"){
        product.dynamicdiscount = "true";
    }   
    else{
        product.dynamicdiscount = "false";
        product.discount =discount;
    } 
    product.dynamicdiscountEnabledAt = new Date();
    await product.save();
    req.flash('success',"Product updated successfully")
    res.redirect('/owners/all')
})
module.exports = router;