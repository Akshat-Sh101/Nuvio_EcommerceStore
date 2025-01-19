const express = require('express');
const router = express.Router()
const upload = require('../config/multer-config');
const productModel = require('../models/productModel')

router.post("/create",upload.single("image"),async (req,res)=>{
    try{
        let {name,price,discount,bgcolor,panelcolor,textcolor} = req.body;

        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor
        })
        req.flash("success","Product created Successfully.") // yha success is the variale which contains the message.
        res.redirect('/owners/admin')
    }
    catch(error){
        req.flash("error","An Error occured,Something went wrong...")
        res.redirect('/owners/admin')
    }
})

module.exports = router;