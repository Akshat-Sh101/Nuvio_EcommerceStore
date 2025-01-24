const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    cartItems: [
        {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        quantity: { type: Number, required: true,default: 1},
        },
  ] ,
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("cart",cartSchema)