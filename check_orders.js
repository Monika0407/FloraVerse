const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/floraverse';

const orderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.model('Order', orderSchema);

async function checkOrders() {
    try {
        console.log('Connecting to:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const latestOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
        if (latestOrders.length === 0) {
            console.log('No orders found in database.');
        } else {
            console.log('Latest Orders (Raw Data):');
            latestOrders.forEach(o => {
                const data = o.toObject();
                console.log(`\nID: ${data._id}`);
                console.log(`Buyer: ${data.buyerName}`);
                console.log(`Product: ${data.productName}`);
                console.log(`Delivery Address: ${data.deliveryAddress ? JSON.stringify(data.deliveryAddress, null, 2) : 'MISSING'}`);
            });
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkOrders();
