const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

const viewOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- Connected to Database ---\n');

        const orders = await Order.find().sort({ createdAt: -1 });

        if (orders.length === 0) {
            console.log('No orders found in the database.');
        } else {
            console.log(`Total Orders: ${orders.length}\n`);
            console.table(orders.map(order => ({
                ID: order._id.toString().slice(-6), // Showing last 6 chars of ID for convenience
                FullID: order._id.toString(),
                Date: order.date,
                Buyer: order.buyerName,
                Product: order.productName,
                Qty: order.quantity,
                Total: `₹${order.totalPrice}`,
                Status: order.paymentStatus
            })));
            console.log('\nTo delete an order, use: node delete_order.js <FullID>');
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Error fetching orders:', err);
        process.exit(1);
    }
};

viewOrders();
