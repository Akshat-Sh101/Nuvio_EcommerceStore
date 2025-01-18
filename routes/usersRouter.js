const express = require('express')
const router = express.Router()

router.get("/",(req,res)=>{
    res.send("Started the project");
})

module.exports = router;