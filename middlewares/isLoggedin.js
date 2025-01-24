const jwt = require('jsonwebtoken')
const userModel = require("../models/userModel")

module.exports.isLoggedin =async (req,res,next)=>{
    if(!req.cookies.token){
        req.flash("error","Something went wrong");
        return res.redirect('/');
    }

    try{
        let decode = jwt.verify(req.cookies.token,process.env.JWT_KEY);
        let user = await userModel
        .findOne({email:decode.email})
        .select('-password'); // means excluding password field for privacy and is not required

        req.user = user; // create a variable user containing the data of user specially for get routes.

        next();
    }
    catch(err){
        req.flash("error","Something went wrong");
        res.redirect('/');
    }

}