const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('CRITICAL ERROR: MONGODB_URI is not defined in .env file.');
    console.log('Please add MONGODB_URI=mongodb://localhost:27017/floraverse to your .env file or provide a remote MongoDB URI.');
    // In a test/dev environment, we might want to continue or exit. 
    // For now, let's just log and try to connect if it's there.
} else {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('Connected to MongoDB Successfully'))
        .catch(err => {
            console.error('Could not connect to MongoDB. Ensure your local MongoDB server is running.');
            console.error('Error details:', err.message);
        });
}

// Product Routes
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/products', async (req, res) => {
    console.log('POST /api/products - Received Body:', req.body);
    const product = new Product(req.body);
    try {
        const newProduct = await product.save();
        console.log('Product saved successfully:', newProduct._id);
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Error saving product to MongoDB:', err.message);
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Order Routes
app.get('/api/orders/:sellerId', async (req, res) => {
    try {
        const orders = await Order.find({ sellerId: req.params.sellerId });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/orders', async (req, res) => {
    const order = new Order(req.body);
    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
