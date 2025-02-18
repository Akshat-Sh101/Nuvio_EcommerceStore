const cron = require('node-cron');
const mongoose = require('mongoose');
const Product = require('../models/productModel'); // Product schema
const Order = require('../models/orderModel');     // Order schema

const dynamicdiscount = () => {
    // Schedule the logic to run daily at midnight (00:00)
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log('Starting dynamic discount update...');
            // Find products with dynamic discount enabled
            const products = await Product.find({ dynamicdiscount: "true" });

            // Current day range
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));

            for (const product of products) {
                // Get the total orders for the product today
                const ordersCount = await Order.aggregate([
                    { $unwind: "$orderItems" },
                    {
                        $match: {
                            "orderItems.product": new mongoose.Types.ObjectId(product._id),
                            orderedAt: { $gte: startOfDay, $lte: endOfDay },
                        },
                    },
                    {
                        $group: {
                            _id: "$orderItems.product",
                            totalQuantity: { $sum: "$orderItems.quantity" },
                        },
                    },
                ]);

                const totalOrdersToday = ordersCount.length > 0 ? ordersCount[0].totalQuantity : 0;

                // Simple Discount Calculation
                const maxDiscountPercent = Math.floor(((product.price - product.minPrice) / product.price) * 100); // Maximum allowable discount
                const ordersScalingFactor = 0.25; // Each order impacts the discount by 0.25%
                const calculatedDiscountPercent = Math.min(
                    maxDiscountPercent,
                    totalOrdersToday * ordersScalingFactor
                );

                // Update the product discount
                product.discount = calculatedDiscountPercent;
                product.totalOrdersToday = totalOrdersToday;
                product.lastUpdated = new Date();

                await product.save(); // Save updated product to the database
            }
            
            console.log('Dynamic discount update completed successfully.');
        } catch (error) {
            console.error('Error during dynamic discount update:', error);
        }
    });
};

module.exports = { dynamicdiscount };
