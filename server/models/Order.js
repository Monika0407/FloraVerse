const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    sellerId: { type: String, required: true },
    buyerName: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    date: { type: String, required: true },
    paymentStatus: { type: String, default: 'Pending' },
    transactionId: { type: String },
    razorpayOrderId: { type: String },
    deliveryAddress: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        addressLine: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
