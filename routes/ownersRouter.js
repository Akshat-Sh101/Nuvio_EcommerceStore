const express = require('express')
const router = express.Router()
const ownerModel = require("../models/ownerModel")

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

router.get("/",(req,res)=>{
    res.send("Started the project");
})


module.exports = router;