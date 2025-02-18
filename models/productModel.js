const { boolean } = require('joi');
const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    image: Buffer,
    name: String,
    price: Number,
    discount: {
        type: Number,
        default:0,
    },
    bgcolor: String,
    panelcolor: String,
    textcolor: String,
    mostviewed: {
        type: Number,
        default:0,
    },
    dynamicdiscount:{
        type: String,
        default: "false",
    },
    minPrice: { type: Number, default: 0 }, // Minimum allowed price
    totalOrdersToday: { type: Number, default: 0 }, // Track daily orders
    dynamicdiscountEnabledAt : { type: Date, default: null },
    createdon: { type: Date, default: Date.now },
});

module.exports = mongoose.model("product",productSchema)