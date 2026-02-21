const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

const deleteOrder = async () => {
    const orderId = process.argv[2];

    if (!orderId) {
        console.error('Please provide an Order ID. Usage: node delete_order.js <OrderID>');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- Connected to Database ---\n');

        const result = await Order.findByIdAndDelete(orderId);

        if (result) {
            console.log(`Successfully deleted order: ${orderId}`);
            console.log(`Details: ${result.buyerName} bought ${result.productName}`);
        } else {
            console.error(`Order with ID ${orderId} not found.`);
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Error deleting order:', err.message);
        process.exit(1);
    }
};

deleteOrder();
