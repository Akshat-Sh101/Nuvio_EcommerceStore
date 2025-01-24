const mongoose = require('mongoose')

const orderSchema =  mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        quantity: { type: Number, required: true },
        // price: { type: Number, required: true },
      },
    ],
    address: String,
    paymentStatus: { type: String, default: 'Paid' },
    totalAmount: { type: String, required: true },
    totalDiscount: { type: String, required: true },
    orderedAt: { type: Date, default: Date.now },
  });

  
module.exports = mongoose.model("order",orderSchema)
  