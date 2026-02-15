const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/floraverse';

async function debug() {
    try {
        await mongoose.connect(MONGODB_URI);
        const orders = await mongoose.connection.db.collection('orders').find().sort({ createdAt: -1 }).limit(10).toArray();
        console.log('--- DB DATA DUMP ---');
        orders.forEach(o => {
            console.log(`ID: ${o._id}`);
            console.log(`Buyer: ${o.buyerName}`);
            console.log(`Date: [${o.date}]`);
            console.log(`Price: ${o.totalPrice} (${typeof o.totalPrice})`);
            console.log('---');
        });

        console.log('Current system date check:');
        const d = new Date();
        const manual = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        console.log(`Manual format: [${manual}]`);
        console.log(`Locale string: [${d.toLocaleDateString()}]`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

debug();
