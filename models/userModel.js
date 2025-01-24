const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    fullname : String,
    email: String,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cart",
    },
    contact: Number,
    picture: {
        type:   Buffer,
    },
});

module.exports = mongoose.model("user",userSchema)